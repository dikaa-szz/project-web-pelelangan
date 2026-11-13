import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import echo from '../services/echo'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import { 
  ShieldCheck, 
  Gavel, 
  Award, 
  Terminal, 
  Car, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Plus 
} from 'lucide-react'
import toast from 'react-hot-toast'

export const Dashboard: React.FC = () => {
  const { user, isSeller, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<'bids' | 'won' | 'profile' | 'dealer'>('bids')
  
  const [bids, setBids] = useState<any[]>([])
  const [wonResults, setWonResults] = useState<any[]>([])
  const [sellerVehicles, setSellerVehicles] = useState<any[]>([])

  const formatRupiah = (val?: number) => {
    if (!val) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/user/dashboard')
      setBids(res.data.bids || [])
      setWonResults(res.data.won_results || [])
      setSellerVehicles(res.data.seller_vehicles || [])
    } catch (err) {
      console.error('Failed to load user dashboard data', err)
    }
  }
  useEffect(() => {
    fetchDashboardData()

    // Setup Echo listener for real-time bid updates
    const channel = echo.channel('auctions')

    channel.listen('.bid.placed', (e: any) => {
      // 1. Update user's bids if auction matches
      setBids((prev) =>
        prev.map((b) => {
          if (b.auction_id === e.auction_id) {
            return {
              ...b,
              auction: {
                ...b.auction,
                current_price: e.current_price,
                total_bids: e.total_bids,
                current_winner_id: e.current_winner_id,
              },
              is_winning: e.current_winner_id === user?.id,
            }
          }
          return b
        })
      )

      // 2. Update dealer/seller vehicles if auction matches
      setSellerVehicles((prev) =>
        prev.map((veh) => {
          if (veh.latest_auction && veh.latest_auction.id === e.auction_id) {
            return {
              ...veh,
              latest_auction: {
                ...veh.latest_auction,
                current_price: e.current_price,
                total_bids: e.total_bids,
                current_winner_id: e.current_winner_id,
              },
            }
          }
          return veh
        })
      )
      // If dealer owns this car, show celebration toast
      if (e.seller_id === user?.id) {
        toast.success(`🎉 Tawaran baru ${formatRupiah(e.current_price)} masuk pada unit Anda (${e.vehicle_title})!`, {
          icon: '🔥',
          duration: 5000,
        })
      }
    })
    // Poll every 8 seconds as fallback
    const interval = setInterval(fetchDashboardData, 8000)
    return () => {
      clearInterval(interval)
      channel.stopListening('.bid.placed')
      echo.leaveChannel('auctions')
    }
  }, [user?.id])

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Identity & Ledger Bar */}
        <div className="p-6 sm:p-8 bg-[#0f1115] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ff5500] text-black font-extrabold text-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,85,0,0.3)]">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white">
                  {user?.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 border border-white/15 text-[#ff5500] uppercase">
                  {user?.role}
                </span>
                {(isSeller || isAdmin) && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#d4f728]/10 border border-[#d4f728]/30 text-[#d4f728] uppercase">
                    DEALER RESMI
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9e9a90] mt-1">
                UID: {user?.id.toString().padStart(6, '0')} • {user?.email} • {user?.phone || 'NO TELP BELUM TERDAFTAR'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#08090b] p-4 border border-white/10">
            <div>
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider block">Saldo Rekening Escrow Jaminan</span>
              <span className="font-display text-xl font-black text-[#d4f728]">
                {formatRupiah(user?.deposit_balance || 0)}
              </span>
            </div>
            <div className="pl-6 border-l border-white/10">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#e2dfd8]">
                <ShieldCheck className="w-4 h-4 text-[#d4f728]" />
                {user?.kyc_verified_at ? 'KYC TERVERIFIKASI' : 'KYC PENDING'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 gap-2 text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'bids'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ 01 // Penawaran Aktif ({bids.length}) ]
          </button>
          <button
            onClick={() => setActiveTab('won')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'won'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ 02 // Lot Dimenangkan ({wonResults.length}) ]
          </button>
          {(isSeller || isAdmin) && (
            <button
              onClick={() => setActiveTab('dealer')}
              className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'dealer'
                  ? 'border-[#d4f728] text-[#d4f728] bg-white/5'
                  : 'border-transparent text-[#9e9a90] hover:text-white'
              }`}
            >
              [ 03 // Konsinyasi Dealer &amp; Lelang ({sellerVehicles.length}) ]
            </button>
          )}
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ {isSeller || isAdmin ? '04' : '03'} // Rekening &amp; Profil ]
          </button>
        </div>

        {/* TAB 01: PENAWARAN AKTIF */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            {bids.length === 0 ? (
              <div className="p-12 bg-[#0f1115] border border-white/10 text-center space-y-4">
                <Gavel className="w-10 h-10 text-[#5e5b54] mx-auto" />
                <h3 className="font-display font-bold text-base uppercase text-white">
                  Tidak Ada Penawaran Aktif
                </h3>
                <p className="text-xs text-[#9e9a90] max-w-md mx-auto font-body">
                  Seluruh penawaran yang Anda ajukan dalam sesi bursa akan tercatat langsung dalam log ini secara real-time.
                </p>
                <div className="pt-2">
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Masuk Ruang Lelang Live &gt;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bids.map((bid) => {
                  const isWinning = Boolean(bid.auction?.current_winner_id === user?.id)
                  const isLive = Boolean(bid.auction && ['live', 'extended'].includes(bid.auction.status))

                  return (
                    <div
                      key={bid.id}
                      className="p-5 bg-[#0f1115] border border-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-18 bg-black border border-white/10 shrink-0 overflow-hidden relative">
                          <img
                            src={getVehicleImageUrl(bid.auction?.vehicle)}
                            onError={handleImageError}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {isLive && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#ff5500] text-black text-[9px] font-black uppercase">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider">
                            LOT #{bid.auction_id?.toString().padStart(4, '0')} // TANGGAL {new Date(bid.created_at).toLocaleDateString('id-ID')}
                          </span>
                          <h4 className="font-display font-bold text-base text-white uppercase">
                            {bid.auction?.title || bid.auction?.vehicle?.title || 'Sesi Lelang'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#9e9a90]">Tawaran Anda:</span>
                            <span className="font-bold text-white">{formatRupiah(bid.amount)}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-[#9e9a90]">Tertinggi:</span>
                            <span className="font-bold text-[#ff5500]">{formatRupiah(bid.auction?.current_price)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end md:self-center">
                        <div>
                          {isWinning ? (
                            <span className="px-3 py-1 bg-[#d4f728]/10 border border-[#d4f728]/40 text-[#d4f728] text-xs font-bold uppercase flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              TAWARAN TERTINGGI (MEMIMPIN)
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-[#ff5500]/10 border border-[#ff5500]/40 text-[#ff5500] text-xs font-bold uppercase flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              TERLEWATI (OUTBID)
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/auction/${bid.auction_id}/live`}
                          className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          Masuk Terminal
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 02: LOT DIMENANGKAN */}
        {activeTab === 'won' && (
          <div>
            {wonResults.length === 0 ? (
              <div className="p-12 bg-[#0f1115] border border-white/10 text-center space-y-4">
                <Award className="w-10 h-10 text-[#5e5b54] mx-auto" />
                <h3 className="font-display font-bold text-base uppercase text-white">
                  Belum Ada Lot yang Selesai Dimenangkan
                </h3>
                <p className="text-xs text-[#9e9a90] max-w-md mx-auto font-body">
                  Setelah lelang berakhir dan Anda dinyatakan sebagai pemenang penawaran tertinggi, invoice pelunasan dan berkas serah terima unit akan diproses di tab ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {wonResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-5 bg-[#0f1115] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-18 bg-black border border-white/10 shrink-0 overflow-hidden">
                        <img
                          src={getVehicleImageUrl(result.auction?.vehicle)}
                          onError={handleImageError}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#d4f728] uppercase font-bold tracking-wider">
                          PEMENANG RESMI LOT #{result.auction_id?.toString().padStart(4, '0')}
                        </span>
                        <h4 className="font-display font-bold text-base text-white uppercase">
                          {result.auction?.title}
                        </h4>
                        <p className="text-xs text-[#9e9a90]">
                          Nilai Akhir: <strong className="text-white">{formatRupiah(result.final_price)}</strong> • Total Invoice: <strong className="text-[#d4f728]">{formatRupiah(result.total_amount)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-bold uppercase ${
                        result.status === 'paid' ? 'bg-[#d4f728] text-black' : 'bg-[#e5a93c] text-black'
                      }`}>
                        {result.status === 'paid' ? 'LUNAS / VERIFIED' : 'MENUNGGU PEMBAYARAN'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 03: KONSINYASI DEALER & LELANG (DEALER / SELLER VIEW) */}
        {activeTab === 'dealer' && (isSeller || isAdmin) && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#d4f728]" />
                  Inventaris Unit Konsinyasi Dealer Anda
                </h3>
                <p className="text-xs text-[#9e9a90] mt-0.5">
                  Monitor real-time tawaran pembeli yang masuk ke unit mobil dealer Anda.
                </p>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-[#d4f728] hover:bg-[#c3e622] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buka Portal Admin
                </Link>
              )}
            </div>

            {sellerVehicles.length === 0 ? (
              <div className="p-12 bg-[#0f1115] border border-white/10 text-center space-y-4">
                <Car className="w-10 h-10 text-[#5e5b54] mx-auto" />
                <h4 className="font-display font-bold text-base uppercase text-white">
                  Belum Ada Unit Konsinyasi Terdaftar
                </h4>
                <p className="text-xs text-[#9e9a90] max-w-md mx-auto">
                  Hubungi admin bursa untuk mendaftarkan armada kendaraan showroom dealer Anda ke dalam sesi lelang live.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sellerVehicles.map((veh) => {
                  const auc = veh.latest_auction
                  const isLive = Boolean(auc && ['live', 'extended'].includes(auc.status))

                  return (
                    <div
                      key={veh.id}
                      className="p-5 bg-[#0f1115] border border-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-18 bg-black border border-white/10 shrink-0 overflow-hidden relative">
                          <img
                            src={getVehicleImageUrl(veh)}
                            onError={handleImageError}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {isLive && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#ff5500] text-black text-[9px] font-black uppercase">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 bg-[#d4f728] text-black text-[9px] font-black uppercase">
                              GRADE {veh.condition_grade}
                            </span>
                            <span className="text-[10px] text-[#5e5b54]">LOT #{veh.id.toString().padStart(4, '0')}</span>
                            <span className="text-[10px] text-[#9e9a90]">• Plat: {veh.license_plate}</span>
                          </div>
                          <h4 className="font-display font-bold text-base text-white uppercase">{veh.title}</h4>
                          {auc ? (
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-[#9e9a90]">Tawaran Tertinggi:</span>
                              <span className="font-bold text-[#ff5500] text-sm">
                                {formatRupiah(auc.current_price)}
                              </span>
                              <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold">
                                {auc.total_bids} Tawaran Masuk
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-[#5e5b54]">Belum dijadwalkan sesi lelang</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        {auc && isLive ? (
                          <Link
                            to={`/auction/${auc.id}/live`}
                            className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                          >
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            Pantau Live Bidding
                          </Link>
                        ) : (
                          <span className="px-3 py-1 bg-white/5 border border-white/10 text-[#9e9a90] text-xs uppercase font-bold">
                            Status: {veh.status}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 04 / 03: DATA PROFIL & REKENING */}
        {activeTab === 'profile' && (
          <div className="p-8 bg-[#0f1115] border border-white/10 max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white border-b border-white/10 pb-3">
              <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
              Data Parameter Identitas Akun
            </div>
            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Nama Lengkap (KTP / Dealer)</span>
                <span className="font-bold text-white">{user?.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Email Terdaftar</span>
                <span className="font-bold text-white">{user?.email}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Klasifikasi Peran</span>
                <span className="font-bold text-[#ff5500] uppercase">{user?.role}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Status Operasional</span>
                <span className="font-bold text-[#d4f728] uppercase">{user?.status}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Verifikasi Dokumen KYC</span>
                <span className="font-bold text-white">
                  {user?.kyc_verified_at ? 'VALIDASI KEPOLISIAN SELESAI' : 'MENUNGGU VERIFIKASI IDENTITAS'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
