import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import echo from '../services/echo'
import { useAuth } from '../context/AuthContext'
import { Auction } from '../types'
import { Gavel, Clock, Flame, User as UserIcon, AlertTriangle, CheckCircle2, ArrowLeft, Radio, Shield } from 'lucide-react'
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
        setCurrentWinnerName(initial.auction.current_winner?.name || 'BELUM ADA')
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
        toast.error('Gagal menghubungkan ke terminal lelang.')
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
        toast('Protokol Anti-Sniping aktif: Durasi bertambah +120 detik!', {
          icon: '⏱️',
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
      toast.error('Autentikasi diperlukan untuk memasukkan penawaran.')
      return
    }

    if (user?.id === data?.auction.vehicle?.seller_id) {
      toast.error('Pemilik unit dilarang menawar unit konsinyasi sendiri.')
      return
    }

    if (user?.id === currentWinnerId) {
      toast.error('Anda telah memegang penawaran tertinggi.')
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

      toast.success(res.data.message || 'Penawaran berhasil dikirim ke bursa!')
      setCustomBid('')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.bid?.[0] || 'Penawaran ditolak sistem.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#ff5500] border-t-transparent animate-spin mx-auto"></div>
          <p className="uppercase tracking-widest">[ MEMBUKA KONEKSI WEBSOCKET TERMINAL... ]</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
        <div className="text-center space-y-3 p-8 border border-white/10 bg-[#0f1115]">
          <p className="font-bold text-white uppercase">[ LOT TIDAK DITEMUKAN ]</p>
          <Link to="/catalog" className="inline-block text-[#ff5500] hover:underline uppercase">
            &lt; Kembali ke Indeks Lot
          </Link>
        </div>
      </div>
    )
  }

  const isUserWinning = user && currentWinnerId === user.id
  const isAntiSnipingActive = secondsRemaining <= (data.auction.auto_extension_threshold || 120) && secondsRemaining > 0
  const isAuctionEnded = secondsRemaining === 0

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-8 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Terminal Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <Link
              to="/catalog"
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#9e9a90] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-[#ff5500] tracking-wider uppercase">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>TERMINAL LELANG LANGSUNG</span>
                <span className="text-white/20">/</span>
                <span className="text-[#9e9a90]">LOT #{data.auction.id.toString().padStart(4, '0')}</span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mt-0.5">
                {data.auction.title}
              </h1>
            </div>
          </div>

          {/* Sync Status Badges */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[#d4f728] text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4f728] animate-pulse"></span>
              WS SYNCHRONIZED
            </div>
            <div className="px-3 py-1 bg-black border border-white/10 text-[11px] text-[#9e9a90]">
              LATENCY: 42MS
            </div>
          </div>
        </div>

        {/* Hazard Alert: Anti-Sniping Protocol */}
        {(isAntiSnipingActive || extendedAlert) && (
          <div className="p-4 bg-[#e5a93c]/10 border border-[#e5a93c]/40 text-[#e5a93c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#e5a93c] shrink-0" />
              <div className="text-xs">
                <span className="font-bold uppercase tracking-wider">[ PROTOKOL ANTI-SNIPING BERJALAN ]</span> Setiap tawaran baru dalam 120 detik terakhir menambah durasi waktu lelang selama +120 detik.
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-[#e5a93c] text-black shrink-0">
              EKSTENSI: {data.auction.extensions_used} / {data.auction.max_extensions}
            </span>
          </div>
        )}

        {/* Live Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual & Control Screen (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Visual Screen with HUD Overlay */}
            <div className="bg-[#0f1115] border border-white/10 relative overflow-hidden">
              <div className="relative aspect-[16/9] sm:aspect-[16/10] bg-black overflow-hidden">
                <img
                  src={
                    data.auction.vehicle?.primary_image?.image_url ||
                    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt=""
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />

                {/* Grade & Plate Overlay */}
                <div className="absolute top-4 left-4 flex gap-2 text-xs">
                  <span className="px-3 py-1 font-bold bg-[#d4f728] text-black">
                    GRADE {data.auction.vehicle?.condition_grade || 'A'}
                  </span>
                  <span className="px-3 py-1 bg-black/90 text-[#e2dfd8] border border-white/20">
                    {data.auction.vehicle?.license_plate}
                  </span>
                </div>

                {/* Countdown Timer Display */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-4 py-2 border flex items-center gap-2 backdrop-blur-md ${
                      isAntiSnipingActive
                        ? 'bg-[#e5a93c]/20 border-[#e5a93c] text-[#e5a93c]'
                        : isAuctionEnded
                        ? 'bg-black/90 border-white/20 text-[#5e5b54]'
                        : 'bg-black/90 border-white/20 text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#ff5500]" />
                    <span className="text-xl font-extrabold tracking-wider">
                      {isAuctionEnded ? 'LELANG SELESAI' : formatTime(secondsRemaining)}
                    </span>
                  </div>
                </div>

                {/* Price Matrix HUD */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-16">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-[#9e9a90] uppercase tracking-wider block">
                        Tawaran Tertinggi Terverifikasi
                      </span>
                      <p
                        className={`font-display text-4xl sm:text-6xl font-black tracking-tight transition-all ${
                          priceFlash ? 'text-[#d4f728] scale-105' : 'text-[#ff5500]'
                        }`}
                      >
                        {formatRupiah(currentPrice)}
                      </p>
                    </div>

                    {/* Current Highest Bidder Card */}
                    <div className="p-3 bg-black/90 border border-white/15 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 text-white flex items-center justify-center">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5e5b54] uppercase block">Penawar Teratas</span>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{currentWinnerName}</span>
                          {isUserWinning && (
                            <span className="px-1.5 py-0.2 bg-[#d4f728] text-black font-extrabold text-[9px]">
                              [ ANDA ]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Terminal Pad */}
            <div className="p-6 bg-[#0f1115] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-white uppercase flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-[#ff5500]" />
                    Panel Eksekusi Penawaran
                  </h3>
                  <p className="text-xs text-[#9e9a90] mt-0.5">
                    Nilai minimum tawaran berikutnya: <span className="text-[#ff5500] font-bold">{formatRupiah(minNextBid)}</span> (Kelipatan: +{formatRupiah(data.auction.bid_increment)})
                  </p>
                </div>
                <div className="text-xs text-[#9e9a90]">
                  <span>TOTAL MASUK: </span>
                  <span className="font-bold text-white">{totalBids} BID</span>
                </div>
              </div>

              {/* Notice if user is highest */}
              {isUserWinning && (
                <div className="p-3 bg-[#d4f728]/10 border border-[#d4f728]/30 text-[#d4f728] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Anda saat ini memegang tawaran tertinggi. Menunggu respon dari peserta lain.</span>
                </div>
              )}

              {/* Quick Multiplier Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid)}
                  className="py-3 px-4 bg-[#1d2028] hover:bg-[#ff5500] hover:text-black disabled:opacity-30 disabled:hover:bg-[#1d2028] disabled:hover:text-[#e2dfd8] border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>+1x Kelipatan</span>
                  <span className="text-[11px] opacity-80 mt-0.5">{formatRupiah(minNextBid)}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid + Number(data.auction.bid_increment))}
                  className="py-3 px-4 bg-[#1d2028] hover:bg-[#ff5500] hover:text-black disabled:opacity-30 disabled:hover:bg-[#1d2028] disabled:hover:text-[#e2dfd8] border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>+2x Kelipatan</span>
                  <span className="text-[11px] opacity-80 mt-0.5">
                    {formatRupiah(minNextBid + Number(data.auction.bid_increment))}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded}
                  onClick={() => handlePlaceBid(minNextBid + Number(data.auction.bid_increment) * 4)}
                  className="py-3 px-4 bg-[#1d2028] hover:bg-[#ff5500] hover:text-black disabled:opacity-30 disabled:hover:bg-[#1d2028] disabled:hover:text-[#e2dfd8] border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>+5x Kelipatan</span>
                  <span className="text-[11px] opacity-80 mt-0.5">
                    {formatRupiah(minNextBid + Number(data.auction.bid_increment) * 4)}
                  </span>
                </button>
              </div>

              {/* Custom Bid Row */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5 text-xs text-[#5e5b54] font-bold">RP</span>
                  <input
                    type="number"
                    disabled={isSubmitting || isUserWinning || isAuctionEnded}
                    value={customBid}
                    onChange={(e) => setCustomBid(e.target.value)}
                    placeholder={`Nominal kustom (min ${minNextBid})`}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#08090b] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff5500] transition-colors"
                  />
                </div>
                <button
                  type="button"
                  disabled={isSubmitting || isUserWinning || isAuctionEnded || !customBid}
                  onClick={() => handlePlaceBid(Number(customBid))}
                  className="px-6 py-2.5 bg-[#e2dfd8] hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  Kirim Bid Kustom
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Tape & Technical Specs (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Bidding Tape */}
            <div className="bg-[#0f1115] border border-white/10 flex flex-col h-[480px]">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#16181f]">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#ff5500]" />
                  Ledger Penawaran Real-Time
                </h3>
                <span className="text-[10px] text-[#9e9a90]">
                  {bids.length} ENTRI
                </span>
              </div>

              {/* Tape Rows */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-white/5">
                {bids.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-[#5e5b54] uppercase tracking-wider">
                    Belum ada entri penawaran.
                  </div>
                ) : (
                  bids.map((b, index) => (
                    <div
                      key={b.id || index}
                      className={`pt-2.5 first:pt-0 flex items-center justify-between text-xs ${
                        b.is_winning ? 'text-[#ff5500] font-bold' : 'text-[#9e9a90]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{b.bidder_name}</span>
                          {b.is_winning && (
                            <span className="px-1 py-0.2 bg-[#d4f728] text-black font-extrabold text-[9px]">
                              TOP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#5e5b54] mt-0.5">
                          {new Date(b.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="font-extrabold text-sm">
                        {formatRupiah(b.amount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Specs Matrix */}
            <div className="p-5 bg-[#0f1115] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold uppercase text-white">Spesifikasi Lot</span>
                <Shield className="w-3.5 h-3.5 text-[#d4f728]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9e9a90]">Odometer:</span>
                  <span className="font-bold text-white">
                    {data.auction.vehicle?.mileage.toLocaleString('id-ID')} KM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e9a90]">Transmisi:</span>
                  <span className="font-bold text-white uppercase">{data.auction.vehicle?.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e9a90]">Bahan Bakar:</span>
                  <span className="font-bold text-white uppercase">{data.auction.vehicle?.fuel_type}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-[#9e9a90]">Audit 175 Titik:</span>
                  <span className="font-bold text-[#d4f728]">
                    {data.auction.vehicle?.inspection?.overall_score || 95}/100
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to={`/vehicle/${data.auction.vehicle_id}`}
                  target="_blank"
                  className="block text-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#e2dfd8] uppercase tracking-wider transition-colors"
                >
                  Buka Laporan Audit Lengkap &gt;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveRoom
