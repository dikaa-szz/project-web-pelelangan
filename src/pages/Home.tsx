import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Auction } from '../types'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import { Gavel, Clock, ArrowRight, ShieldCheck, ChevronRight, Activity, Cpu, Sparkles, Star, CheckCircle, Radio } from 'lucide-react'

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
    <div className="min-h-screen bg-[#06080d] text-slate-100 selection:bg-emerald-400 selection:text-black">
      
      {/* Top Realtime Status Bar */}
      <div className="border-b border-white/[0.06] bg-[#080b12]/80 backdrop-blur-md px-4 py-2.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              BURSA AKTIF
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">WebSocket Gateway Reverb</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 font-mono hidden sm:inline">Latensi &lt;50ms</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400">Sertifikasi Inspeksi 175 Titik</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Garansi Bebas Banjir &amp; Tabrakan
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section: Modern Luxury Automotive Presentation */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-white/[0.06]">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Platform Lelang Mobil Premium &amp; Terverifikasi</span>
              </div>

              <div className="space-y-5">
                <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
                  Bursa Lelang Otomotif <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Eksklusif &amp; Terbuka.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                  Dapatkan mobil impian dengan penawaran transparan secara real-time. Setiap kendaraan telah melewati audit komprehensif 175 parameter, garansi keaslian dokumen BPKB, dan histori terjamin.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/live"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>Ikut Sesi Lelang LIVE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/catalog"
                  className="px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Jelajahi Katalog Lot</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">175</p>
                  <p className="text-xs text-slate-400 mt-1">Titik Audit Standar</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400 mt-1">Dokumen Asli &amp; Sah</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-cyan-400">&lt;50ms</p>
                  <p className="text-xs text-slate-400 mt-1">Penawaran Instan</p>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Live Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/[0.1] bg-[#0c1017]/90 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-rose-400">
                      LOT SOROTAN UTAMA
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    STATUS LIVE
                  </span>
                </div>

                {liveAuctions.length > 0 ? (
                  <div className="space-y-4 pt-4">
                    <div className="relative aspect-[16/10] rounded-2xl bg-slate-900 border border-white/[0.08] overflow-hidden">
                      <img
                        src={getVehicleImageUrl(liveAuctions[0].vehicle)}
                        onError={handleImageError}
                        alt={liveAuctions[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE
                      </div>
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-emerald-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        GRADE {liveAuctions[0].vehicle?.condition_grade || 'A'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">
                        LOT #{liveAuctions[0].id.toString().padStart(4, '0')}
                      </span>
                      <h3 className="font-extrabold text-lg text-white truncate">
                        {liveAuctions[0].title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {liveAuctions[0].vehicle?.year} • {liveAuctions[0].vehicle?.transmission} • {liveAuctions[0].vehicle?.mileage?.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tawaran Tertinggi</span>
                        <span className="text-xl font-black text-emerald-400">
                          {formatRupiah(liveAuctions[0].current_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aktivitas</span>
                        <span className="text-sm font-bold text-white">{liveAuctions[0].total_bids} Penawaran</span>
                      </div>
                    </div>

                    <Link
                      to={`/auction/${liveAuctions[0].id}/live`}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/15"
                    >
                      <span>Masuk Ruang Lelang Ini</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <Activity className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">
                      Belum ada sesi lelang aktif saat ini.
                    </p>
                    <Link
                      to="/catalog"
                      className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] transition-all"
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
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              <span>SESI AKTIF REAL-TIME</span>
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Sesi Lelang Sedang Berlangsung
            </h2>
          </div>
          <Link
            to="/catalog?status=live"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            Lihat Semua Lot Aktif &gt;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-[#0c1017] border border-white/[0.06] animate-pulse p-6 space-y-4">
                <div className="h-48 rounded-2xl bg-white/[0.04]"></div>
                <div className="h-5 rounded bg-white/[0.06] w-2/3"></div>
                <div className="h-4 rounded bg-white/[0.04] w-1/2"></div>
              </div>
            ))}
          </div>
        ) : liveAuctions.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-dashed border-white/[0.1] bg-[#0c1017]/50 space-y-3">
            <Clock className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-base font-bold text-white">Tidak ada sesi lelang yang sedang live saat ini.</p>
            <p className="text-xs text-slate-400">
              Silakan cek jadwal lelang mendatang untuk mendaftar dan memasang penawaran.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group rounded-3xl bg-[#0c1017]/90 border border-white/[0.07] hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={getVehicleImageUrl(auction.vehicle)}
                      onError={handleImageError}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                        GRADE {auction.vehicle?.condition_grade || 'A'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md border border-white/20 text-slate-300">
                      {auction.total_bids} TAWARAN
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                        LOT #{auction.id.toString().padStart(4, '0')}
                      </span>
                      <h3 className="font-bold text-base text-white truncate group-hover:text-emerald-300 transition-colors">
                        {auction.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {auction.vehicle?.year} • {auction.vehicle?.transmission} • {auction.vehicle?.mileage?.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tawaran Tertinggi Saat Ini</span>
                      <span className="text-lg font-black text-emerald-400">
                        {formatRupiah(auction.current_price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/auction/${auction.id}/live`}
                    className="w-full py-3 rounded-2xl bg-white/[0.05] hover:bg-emerald-400 hover:text-slate-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/[0.08] transition-all"
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
      <section className="py-20 bg-[#080b12]/80 border-t border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">
                JADWAL RESMI LELANG
              </p>
              <h2 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Lot Terjadwal Berikutnya
              </h2>
            </div>
            <Link to="/catalog" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
              Buka Indeks Jadwal &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledAuctions.map((auction) => (
              <div
                key={auction.id}
                className="rounded-3xl bg-[#0c1017]/90 border border-white/[0.07] p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-white/[0.06] pb-3">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {new Date(auction.start_time).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      GRADE {auction.vehicle?.condition_grade || 'A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                      LOT #{auction.id.toString().padStart(4, '0')}
                    </span>
                    <h3 className="font-bold text-base text-white truncate">
                      {auction.title}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Harga Awal</span>
                      <span className="font-bold text-white font-mono">{formatRupiah(auction.start_price)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/[0.04] pt-2">
                      <span className="text-slate-400">Kelipatan Bid</span>
                      <span className="text-amber-400 font-semibold font-mono">+{formatRupiah(auction.bid_increment)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/vehicle/${auction.vehicle_id}`}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    Lihat Hasil Audit 175 Titik &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Audit Protocol Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 space-y-3">
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
            STANDAR AUDIT &amp; INTEGRITAS TINGGI
          </p>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Keamanan Transaksi AutoBid
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Setiap tahapan lelang didesain tanpa perantara tidak resmi, menjamin transparansi, legalitas dokumen hukum, dan akurasi kondisi fisik unit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0c1017]/90 border border-white/[0.07] space-y-4 hover:border-emerald-500/30 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">
              Audit Fisik 175 Parameter
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Inspeksi kompresi mesin, kelistrikan komputer OBD scanner, struktur pilar sasis dari benturan fatal, uji ketebalan mikron cat, serta bebas rendaman banjir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0c1017]/90 border border-white/[0.07] space-y-4 hover:border-amber-500/30 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">
              Verifikasi Dokumen BPKB
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Pengecekan keabsahan berkas kepolisian BPKB asli, STNK, faktur pembelian pertama, dan histori tilang elektronik (ETLE) yang bersih.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0c1017]/90 border border-white/[0.07] space-y-4 hover:border-cyan-500/30 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">
              Escrow Settlement Terjamin
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Dana pemenang lelang ditampung di rekening escrow resmi hingga proses serah terima unit kendaraan dan pengecekan fisik final selesai.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
