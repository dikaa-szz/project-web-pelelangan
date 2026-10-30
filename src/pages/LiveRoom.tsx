import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import echo from '../services/echo'
import { useAuth } from '../context/AuthContext'
import { Auction } from '../types'
import { Gavel, Clock, Flame, User as UserIcon, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface LiveRoomData {
  auction: Auction
  is_live: boolean
  server_time: string
  end_time: string
  time_remaining_seconds: number
  min_next_bid: number
  total_bids: number
  recent_bids: Array<{
    id: number
    user_id: number
    bidder_name: string
    amount: number
    is_winning: boolean
    created_at: string
  }>
}

export const LiveRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()

  const [data, setData] = useState<LiveRoomData | null>(null)
  const [bids, setBids] = useState<any[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentWinnerId, setCurrentWinnerId] = useState<number | null>(null)
  const [currentWinnerName, setCurrentWinnerName] = useState<string>('')
  const [minNextBid, setMinNextBid] = useState<number>(0)
  const [totalBids, setTotalBids] = useState<number>(0)
  const [customBid, setCustomBid] = useState<string>('')

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceFlash, setPriceFlash] = useState(false)
  const [extendedAlert, setExtendedAlert] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch initial live room data
  useEffect(() => {
    let timerInterval: any = null

    const fetchLiveRoom = async () => {
      try {
        const res = await api.get(`/auctions/${id}/live`)
        const initial = res.data as LiveRoomData
        setData(initial)
        setBids(initial.recent_bids || [])
        setCurrentPrice(initial.auction.current_price)
        setCurrentWinnerId(initial.auction.current_winner_id || null)
        setCurrentWinnerName(initial.auction.current_winner?.name || 'Belum ada')
        setMinNextBid(initial.min_next_bid)
        setTotalBids(initial.total_bids)
        setSecondsRemaining(initial.time_remaining_seconds)

        // Start countdown
        timerInterval = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } catch (err) {
        console.error('Failed to load live room', err)
        toast.error('Gagal memuat ruang lelang.')
      } finally {
        setLoading(false)
      }
    }

    fetchLiveRoom()

    // Setup Laravel Echo WebSocket listener
    const channel = echo.channel(`auction.${id}`)

    channel.listen('.bid.placed', (e: any) => {
      console.log('Real-Time Bid Received:', e)

      setCurrentPrice(e.current_price)
      setMinNextBid(e.min_next_bid)
      setTotalBids(e.total_bids)
      setCurrentWinnerId(e.current_winner_id)
      setCurrentWinnerName(e.current_winner_name)

      // Trigger visual flash
      setPriceFlash(true)
      setTimeout(() => setPriceFlash(false), 1500)

      // Prepend bid to live bids
      setBids((prev) => [
        {
          id: e.bid.id,
          user_id: e.current_winner_id,
          bidder_name: e.current_winner_name,
          amount: e.bid.amount,
          is_winning: true,
          created_at: e.bid.created_at,
        },
        ...prev.map((b) => ({ ...b, is_winning: false })),
      ])

      // If extended
      if (e.extended) {
        setExtendedAlert(true)
        toast('Waktu lelang diperpanjang otomatis +2 menit!', {
          icon: '⏳',
          duration: 4000,
        })
        const newSeconds = Math.max(0, Math.floor((new Date(e.end_time).getTime() - Date.now()) / 1000))
        setSecondsRemaining(newSeconds)
      }
    })

    channel.listen('.auction.extended', (e: any) => {
      const newSeconds = Math.max(0, Math.floor((new Date(e.new_end_time).getTime() - Date.now()) / 1000))
      setSecondsRemaining(newSeconds)
      setExtendedAlert(true)
      setTimeout(() => setExtendedAlert(false), 5000)
    })

    return () => {
      if (timerInterval) clearInterval(timerInterval)
      channel.stopListening('.bid.placed')
      channel.stopListening('.auction.extended')
      echo.leaveChannel(`auction.${id}`)
    }
  }, [id])

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle submit penawaran (bid)
  const handlePlaceBid = async (amount: number) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu untuk menawar.')
      return
    }

    if (user?.id === data?.auction.vehicle?.seller_id) {
      toast.error('Penjual tidak diizinkan menawar unit miliknya sendiri.')
      return
    }

    if (user?.id === currentWinnerId) {
      toast.error('Anda sudah memegang penawaran tertinggi!')
      return
    }

    if (amount < minNextBid) {
      toast.error(`Nominal minimal adalah ${formatRupiah(minNextBid)}`)
      return
    }

    setIsSubmitting(true)
    try {
      // Buat idempotency key unik untuk request ini
      const idempotencyKey = crypto.randomUUID()

      const res = await api.post(`/auctions/${id}/bid`, {
        amount,
        idempotency_key: idempotencyKey,
      })

      toast.success(res.data.message || 'Penawaran berhasil diajukan!')
      setCustomBid('')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.bid?.[0] || 'Penawaran gagal.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm">Menghubungkan ke Ruang Lelang Real-Time...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-white">Sesi lelang tidak ditemukan.</p>
          <Link to="/catalog" className="text-sm text-blue-400 hover:underline">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    )
  }

  const isUserWinning = user && currentWinnerId === user.id
  const isAntiSnipingActive = secondsRemaining <= (data.auction.auto_extension_threshold || 120) && secondsRemaining > 0
  const isAuctionEnded = secondsRemaining === 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">LIVE AUCTION ROOM</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">ID #{data.auction.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{data.auction.title}</h1>
            </div>
          </div>

          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              WebSocket Live Sync
            </div>
          </div>
        </div>

        {/* Anti-Sniping Alert Banner */}
        {(isAntiSnipingActive || extendedAlert) && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Fase Anti-Sniping Aktif!</span> Setiap penawaran baru di bawah 2 menit akan memperpanjang durasi lelang secara otomatis (+120 detik).
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 shrink-0">
              {data.auction.extensions_used} / {data.auction.max_extensions} Terpakai
            </span>
          </div>
        )}

        {/* Main Live Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Car Visual & Price Ticker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Stage Card */}
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              {/* Car Image with Live Overlay */}
              <div className="relative h-[280px] sm:h-[400px] bg-slate-950 overflow-hidden">
                <img
                  src={
                    data.auction.vehicle?.primary_image?.image_url ||
                    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />

                {/* Grade Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg">
                    Grade {data.auction.vehicle?.condition_grade || 'A'}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 text-slate-200 border border-slate-700">
                    {data.auction.vehicle?.license_plate}
                  </span>
                </div>

                {/* Floating Timer in Stage */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-4 py-2 rounded-2xl backdrop-blur-md border flex items-center gap-2 shadow-xl ${
                      isAntiSnipingActive
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : isAuctionEnded
                        ? 'bg-slate-900/90 border-slate-700 text-slate-400'
                        : 'bg-slate-900/80 border-slate-700 text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-lg font-black tracking-wider">
                      {isAuctionEnded ? 'LELANG SELESAI' : formatTime(secondsRemaining)}
                    </span>
                  </div>
                </div>

                {/* Current Winner Bar Bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 pt-12">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                        Harga Penawaran Tertinggi
                      </p>
                      <p
                        className={`text-3xl sm:text-5xl font-black transition-all ${
                          priceFlash ? 'text-emerald-400 scale-105' : 'text-blue-400'
                        }`}
                      >
                        {formatRupiah(currentPrice)}
                      </p>
                    </div>

                    {/* Winner Status Banner */}
                    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Pemegang Tawaran Teratas</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          {currentWinnerName}
                          {isUserWinning && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ANDA
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Bid Keypad Area */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-blue-400" /> Ajukan Penawaran Live
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Minimal bid berikutnya: <span className="text-blue-400 font-bold">{formatRupiah(minNextBid)}</span> (+{formatRupiah(data.auction.bid_increment)})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">Total Masuk: </span>
                  <span className="text-xs font-extrabold text-white">{totalBids} Bid</span>
                </div>
              </div>

              {/* Status Warning if User is Current Winner */}
              {isUserWinning && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Anda saat ini adalah penawar tertinggi. Anda tidak perlu menawar lagi saat ini.</span>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid)}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex flex-col items-center justify-center transition-all shadow-md shadow-blue-600/20"
                >
                  <span>+1x Kelipatan</span>
                  <span className="text-[11px] opacity-90">{formatRupiah(minNextBid)}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid + Number(data.auction.bid_increment))}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex flex-col items-center justify-center transition-all shadow-md shadow-indigo-600/20"
                >
                  <span>+2x Kelipatan</span>
                  <span className="text-[11px] opacity-90">
                    {formatRupiah(minNextBid + Number(data.auction.bid_increment))}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid + Number(data.auction.bid_increment) * 4)}
                  className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex flex-col items-center justify-center transition-all shadow-md shadow-purple-600/20"
                >
                  <span>+5x Kelipatan</span>
                  <span className="text-[11px] opacity-90">
                    {formatRupiah(minNextBid + Number(data.auction.bid_increment) * 4)}
                  </span>
                </button>
              </div>

              {/* Custom Bid Input */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-3 text-xs text-slate-500 font-bold">Rp</span>
                  <input
                    type="number"
                    disabled={isSubmitting || isUserWinning || isAuctionEnded}
                    value={customBid}
                    onChange={(e) => setCustomBid(e.target.value)}
                    placeholder={`Masukkan nominal kustom (min ${minNextBid})`}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded || !customBid}
                  onClick={() => handlePlaceBid(Number(customBid))}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  Kirim Bid Kustom
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Feed & Specs */}
          <div className="space-y-6">
            {/* Live Bidding Feed Card */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-[520px]">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Riwayat Tawaran Live
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  {bids.length} Catatan
                </span>
              </div>

              {/* Scrollable Bid Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-800/40">
                {bids.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Belum ada penawaran yang diajukan.
                  </div>
                ) : (
                  bids.map((b, index) => (
                    <div
                      key={b.id || index}
                      className={`pt-2.5 first:pt-0 flex items-center justify-between text-xs ${
                        b.is_winning ? 'text-blue-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                            b.is_winning
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {b.bidder_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight">
                            {b.bidder_name}
                            {b.is_winning && (
                              <span className="ml-1.5 text-[10px] text-emerald-400 font-bold">★ Highest</span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(b.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-right font-black text-sm">
                        {formatRupiah(b.amount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Car Summary */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Kendaraan</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Odometer:</span>
                  <span className="font-semibold text-white">
                    {data.auction.vehicle?.mileage.toLocaleString('id-ID')} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transmisi:</span>
                  <span className="font-semibold text-white capitalize">{data.auction.vehicle?.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bahan Bakar:</span>
                  <span className="font-semibold text-white capitalize">{data.auction.vehicle?.fuel_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Skor Inspeksi:</span>
                  <span className="font-bold text-emerald-400">
                    {data.auction.vehicle?.inspection?.overall_score || 95}/100 (Grade {data.auction.vehicle?.condition_grade})
                  </span>
                </div>
              </div>
              <Link
                to={`/vehicle/${data.auction.vehicle_id}`}
                target="_blank"
                className="block text-center pt-2 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Buka Laporan Inspeksi Lengkap ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LiveRoom
