import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Auction } from '../types'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import { Gavel, Clock, ArrowRight, ShieldCheck, ChevronRight, Activity, Car, Award, Star, CheckCircle, Radio, Sparkles } from 'lucide-react'

export const Home: React.FC = () => {
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([])
  const [scheduledAuctions, setScheduledAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const [liveRes, schedRes] = await Promise.all([
          api.get('/auctions?status=live'),
          api.get('/auctions?status=scheduled'),
        ])
        setLiveAuctions(liveRes.data.data || [])
        setScheduledAuctions(schedRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch home auctions', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAuctions()
  }, [])

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Status & Assurance Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0d1322]/80 backdrop-blur-md px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BURSA AKTIF
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">Pelelangan Kendaraan Resmi &amp; Terverifikasi</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Sertifikasi 175 Titik Inspeksi
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Garansi Bebas Banjir &amp; Tabrak
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section: Modern Corporate Luxury */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Bursa Lelang Otomotif Terpercaya #1 Indonesia</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Dapatkan Mobil Berkualitas <br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    Melalui Lelang Transparan.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Ikuti penawaran mobil idaman secara langsung dan real-time. Semua unit telah melewati audit independen 175 titik, jaminan keaslian dokumen BPKB, serta pembayaran aman melalui rekening resmi.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/live"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all group cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                  <span>Ikut Sesi Lelang LIVE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                
                <Link
                  to="/catalog"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Lihat Katalog Mobil</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </Link>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">175</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Titik Cek Inspeksi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keaslian BPKB/STNK</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">Escrow</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jaminan Aman 100%</p>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Live Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-5 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      LELANG UTAMA SEDANG LIVE
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    LIVE NOW
                  </span>
                </div>

                {liveAuctions.length > 0 ? (
                  <div className="space-y-4 pt-4">
                    <div className="relative aspect-[16/10] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <img
                        src={getVehicleImageUrl(liveAuctions[0].vehicle)}
                        onError={handleImageError}
                        alt={liveAuctions[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        GRADE {liveAuctions[0].vehicle?.condition_grade || 'A'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                        LOT #{liveAuctions[0].id.toString().padStart(4, '0')}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                        {liveAuctions[0].title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {liveAuctions[0].vehicle?.year} • {liveAuctions[0].vehicle?.transmission} • {liveAuctions[0].vehicle?.mileage?.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Tawaran Tertinggi</span>
                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                          {formatRupiah(liveAuctions[0].current_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Aktivitas</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {liveAuctions[0].total_bids} Penawaran
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/auction/${liveAuctions[0].id}/live`}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <span>Masuk Ruang Lelang Ini</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                ) : (
                  <div className="py-14 text-center space-y-3">
                    <Activity className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Belum ada sesi lelang aktif saat ini.
                    </p>
                    <Link
                      to="/catalog"
                      className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      Lihat Jadwal Lelang Mendatang
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Auctions Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>PENAWARAN REAL-TIME</span>
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Sesi Lelang Sedang Berlangsung
            </h2>
          </div>
          <Link
            to="/catalog?status=live"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
          >
            Lihat Semua Mobil Live &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 animate-pulse p-5 space-y-4 shadow-sm">
                <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                <div className="h-5 rounded bg-slate-200 dark:bg-slate-800 w-2/3"></div>
                <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/60 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : liveAuctions.length === 0 ? (
          <div className="p-14 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a]/50 space-y-2">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-slate-800 dark:text-white">Tidak ada sesi lelang yang sedang live saat ini.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Silakan cek jadwal lelang mendatang untuk mendaftar dan melihat unit mobil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <img
                      src={getVehicleImageUrl(auction.vehicle)}
                      onError={handleImageError}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm">
                        GRADE {auction.vehicle?.condition_grade || 'A'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {auction.total_bids} Tawaran
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase block mb-1">
                        LOT #{auction.id.toString().padStart(4, '0')}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {auction.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {auction.vehicle?.year} • {auction.vehicle?.transmission} • {auction.vehicle?.mileage?.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Tawaran Tertinggi</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                        {formatRupiah(auction.current_price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/auction/${auction.id}/live`}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    Ikut Lelang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Lots Section */}
      <section className="py-16 bg-white dark:bg-[#0d1322] border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1.5">
                JADWAL RESMI
              </p>
              <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Lelang Terjadwal Mendatang
              </h2>
            </div>
            <Link to="/catalog" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              Buka Jadwal Lengkap &rarr;
            </Link>
          </div>

          {scheduledAuctions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              Belum ada jadwal lelang mendatang.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-sm"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {new Date(auction.start_time).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        GRADE {auction.vehicle?.condition_grade || 'A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block mb-0.5">
                        LOT #{auction.id.toString().padStart(4, '0')}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {auction.title}
                      </h3>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Harga Pembukaan</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatRupiah(auction.start_price)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Kelipatan Bid</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">+{formatRupiah(auction.bid_increment)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <Link
                      to={`/vehicle/${auction.vehicle_id}`}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      Lihat Hasil Inspeksi &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Security & Audit Protocol Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-2">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            STANDAR KUALITAS &amp; KEPERCAYAAN
          </p>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Mengapa Memilih Lelang di AutoBid?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Setiap tahapan transaksi dirancang secara profesional untuk memberikan rasa aman dan kenyamanan maksimal bagi para pembeli dan penjual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Inspeksi Komprehensif 175 Titik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mulai dari mesin, transmisi, pilar sasis utama, ketebalan cat, hingga interior dicek detail oleh inspektur profesional bersertifikat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Verifikasi Legalitas Dokumen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pengecekan keaslian nomor rangka, mesin, BPKB asli, STNK, dan faktur kendaraan melalui sinkronisasi data kepolisian dan Samsat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Transaksi Escrow Resmi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dana penawaran dan deposit ditampung pada akun escrow resmi hingga serah terima unit kendaraan tuntas tanpa risiko penipuan.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home