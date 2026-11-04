import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Auction } from '../types'
import { Gavel, Clock, ArrowRight, ShieldCheck, ChevronRight, Activity, Cpu, Disc3 } from 'lucide-react'

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
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] selection:bg-[#ff5500] selection:text-black">
      {/* Top Telemetry Strip */}
      <div className="border-b border-white/10 bg-[#050608] px-4 py-2 font-mono text-[11px] text-[#9e9a90]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#ff5500]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse"></span>
              BURSA AKTIF
            </span>
            <span className="text-white/20">/</span>
            <span>NODE: JKT-01</span>
            <span className="text-white/20">/</span>
            <span>LATENSI KONSENSUS: &lt;85MS</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span>KLIRING LELANG SETIAP HARI KERJA</span>
            <span className="text-white/20">/</span>
            <span className="text-[#d4f728]">PROTOKOL ANTI-SNIPING: +120S AKTIF</span>
          </div>
        </div>
      </div>

      {/* Hero Section: Asymmetric Technical Split */}
      <section className="relative border-b border-white/10 bg-[#08090b] bg-grid-pattern py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Sharp Copy */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider text-[#9e9a90] uppercase">
                <span className="w-2 h-2 bg-[#ff5500]"></span>
                Infrastruktur Penawaran Otomotif Terbuka
              </div>

              <div className="space-y-4">
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter uppercase text-[#e2dfd8] leading-[0.95]">
                  Bursa Lelang <br />
                  <span className="text-[#ff5500]">Mobil Terverifikasi.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#9e9a90] font-body max-w-xl leading-relaxed">
                  Penawaran terbuka berbasis konsensus WebSocket langsung. Setiap unit wajib lolos audit fisik 175 parameter independen dengan sertifikat legalitas BPKB dan faktur terkonfirmasi.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/live"
                  className="px-8 py-3.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(255,85,0,0.3)]"
                >
                  <Gavel className="w-4 h-4" />
                  Masuk Ruang Lelang Langsung
                </Link>
                <Link
                  to="/catalog"
                  className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[#e2dfd8] font-mono font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Indeks Katalog Lot
                  <ArrowRight className="w-4 h-4 text-[#9e9a90]" />
                </Link>
              </div>

              {/* Technical Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 font-mono">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#e2dfd8]">175</p>
                  <p className="text-[10px] text-[#9e9a90] uppercase tracking-wider mt-0.5">Titik Audit Fisik</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#ff5500]">0%</p>
                  <p className="text-[10px] text-[#9e9a90] uppercase tracking-wider mt-0.5">Biaya Tersembunyi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#d4f728]">+120s</p>
                  <p className="text-[10px] text-[#9e9a90] uppercase tracking-wider mt-0.5">Anti-Sniping Buffer</p>
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Live Terminal Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#0f1115] border border-white/15 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3 border-b border-white/10 bg-[#16181f] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping"></span>
                    <span className="font-bold text-[#e2dfd8] uppercase">LOT SOROTAN AKTIF</span>
                  </div>
                  <span className="text-[10px] text-[#9e9a90]">FEED_ID: 0x9A4F</span>
                </div>

                {/* Hero Feature Box */}
                {liveAuctions.length > 0 ? (
                  <div className="p-5 space-y-4 font-mono">
                    <div className="relative aspect-[16/10] bg-black border border-white/10 overflow-hidden">
                      <img
                        src={
                          liveAuctions[0].vehicle?.primary_image?.image_url ||
                          'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={liveAuctions[0].title}
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm border border-white/20 px-2 py-0.5 text-[10px] text-[#ff5500] font-bold">
                        SEDANG BERLANGSUNG
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-[#d4f728] text-black font-extrabold text-[10px] px-2 py-0.5">
                        GRADE {liveAuctions[0].vehicle?.condition_grade || 'A'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-[#9e9a90] uppercase">LOT #{liveAuctions[0].id.toString().padStart(4, '0')}</p>
                      <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight line-clamp-1">
                        {liveAuctions[0].title}
                      </h3>
                      <p className="text-xs text-[#9e9a90]">
                        {liveAuctions[0].vehicle?.year} • {liveAuctions[0].vehicle?.transmission} • {liveAuctions[0].vehicle?.mileage.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-3 bg-[#08090b] border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#9e9a90] uppercase block">Tawaran Tertinggi</span>
                        <span className="text-lg font-extrabold text-[#ff5500]">
                          {formatRupiah(liveAuctions[0].current_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#9e9a90] uppercase block">Total Penawar</span>
                        <span className="text-sm font-bold text-[#e2dfd8]">{liveAuctions[0].total_bids} Entri</span>
                      </div>
                    </div>

                    <Link
                      to={`/auction/${liveAuctions[0].id}/live`}
                      className="w-full py-3 bg-[#e2dfd8] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      Buka Terminal Lelang Ini
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-4 font-mono">
                    <Activity className="w-10 h-10 text-[#5e5b54] mx-auto" />
                    <p className="text-xs text-[#9e9a90] uppercase tracking-wider">
                      Menunggu antrian kliring lot berikutnya
                    </p>
                    <Link
                      to="/catalog"
                      className="inline-flex px-4 py-2 border border-white/20 text-xs text-[#e2dfd8] hover:border-[#ff5500] hover:text-[#ff5500] transition-colors"
                    >
                      Cek Jadwal Kalender
                    </Link>
                  </div>
                )}

                {/* Footer Status Bar */}
                <div className="px-5 py-2.5 border-t border-white/10 bg-[#050608] flex items-center justify-between text-[10px] font-mono text-[#5e5b54]">
                  <span>HASH: 8F3D...E91A</span>
                  <span>ENCRYPTED WS: WSS://127.0.0.1:8080</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Auctions Section (Bento Grid) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff5500] font-mono text-xs uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 bg-[#ff5500] animate-ping"></span>
              [ SESI AKTIF // REAL-TIME DISPATCH ]
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#e2dfd8]">
              Lot Lelang Sedang Berjalan
            </h2>
          </div>
          <Link
            to="/catalog?status=live"
            className="text-xs font-mono uppercase text-[#9e9a90] hover:text-[#ff5500] flex items-center gap-1.5 transition-colors"
          >
            Lihat Semua Lot Aktif &gt;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-[#0f1115] border border-white/10 animate-pulse p-6 space-y-4">
                <div className="h-48 bg-white/5"></div>
                <div className="h-4 bg-white/10 w-2/3"></div>
                <div className="h-4 bg-white/5 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : liveAuctions.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/15 bg-[#0f1115] font-mono space-y-3">
            <Clock className="w-10 h-10 text-[#5e5b54] mx-auto" />
            <p className="text-sm uppercase text-[#e2dfd8] tracking-wider">Tidak ada lot aktif saat ini.</p>
            <p className="text-xs text-[#9e9a90]">
              Silakan periksa daftar jadwal lelang mendatang di bawah untuk reservasi penawaran.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group bg-[#0f1115] border border-white/10 hover:border-[#ff5500]/70 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden border-b border-white/10">
                    <img
                      src={
                        auction.vehicle?.primary_image?.image_url ||
                        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 bg-[#ff5500] text-black font-extrabold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
                        LIVE
                      </span>
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[#e2dfd8]">
                        GRADE {auction.vehicle?.condition_grade || 'A'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 font-mono text-[10px] bg-black/85 border border-white/20 text-[#9e9a90]">
                      {auction.total_bids} BIDS
                    </div>
                  </div>

                  {/* Lot Metadata */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#5e5b54] tracking-widest uppercase block mb-1">
                        LOT #{auction.id.toString().padStart(4, '0')} // KONSINYASI
                      </span>
                      <h3 className="font-display font-bold text-base text-[#e2dfd8] uppercase line-clamp-1 group-hover:text-[#ff5500] transition-colors">
                        {auction.title}
                      </h3>
                      <p className="text-xs font-mono text-[#9e9a90] mt-1">
                        {auction.vehicle?.year} • {auction.vehicle?.transmission} • {auction.vehicle?.mileage.toLocaleString('id-ID')} KM
                      </p>
                    </div>

                    <div className="p-3 bg-[#08090b] border border-white/10 font-mono">
                      <span className="text-[10px] text-[#9e9a90] uppercase block">Tawaran Tertinggi Saat Ini</span>
                      <span className="text-base font-extrabold text-[#ff5500]">
                        {formatRupiah(auction.current_price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/auction/${auction.id}/live`}
                    className="w-full py-3 bg-[#1d2028] hover:bg-[#ff5500] hover:text-black text-[#e2dfd8] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all"
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
      <section className="py-20 bg-[#050608] border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs text-[#e5a93c] uppercase tracking-widest mb-1.5">
                [ ANTRIAN PENAWARAN // JADWAL RESMI ]
              </p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#e2dfd8]">
                Lot Terjadwal Berikutnya
              </h2>
            </div>
            <Link to="/catalog" className="font-mono text-xs text-[#9e9a90] hover:text-[#e5a93c] transition-colors uppercase">
              Buka Indeks Jadwal &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledAuctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-[#0f1115] border border-white/10 p-6 flex flex-col justify-between hover:border-white/30 transition-colors font-mono"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                    <span className="flex items-center gap-1.5 text-[#9e9a90] text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#e5a93c]" />
                      {new Date(auction.start_time).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 text-[#d4f728]">
                      GRADE {auction.vehicle?.condition_grade || 'A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#5e5b54] tracking-widest uppercase block mb-1">
                      LOT #{auction.id.toString().padStart(4, '0')}
                    </span>
                    <h3 className="font-display font-bold text-base text-white uppercase line-clamp-1">
                      {auction.title}
                    </h3>
                  </div>

                  <div className="p-3 bg-[#08090b] border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#9e9a90] text-[11px]">HARGA AWAL</span>
                      <span className="font-bold text-white">{formatRupiah(auction.start_price)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1">
                      <span className="text-[#9e9a90] text-[11px]">KELIPATAN</span>
                      <span className="text-[#e5a93c]">+{formatRupiah(auction.bid_increment)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/vehicle/${auction.vehicle_id}`}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#e2dfd8] text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Hasil Audit 175 Titik &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Architecture / Anti-AI Bento Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 space-y-2">
          <p className="font-mono text-xs text-[#9e9a90] uppercase tracking-widest">
            [ STANDAR AUDIT &amp; KONSENSUS ]
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#e2dfd8]">
            Protokol Keamanan Transaksi
          </h2>
          <p className="text-sm text-[#9e9a90] font-body">
            Dirancang tanpa perantara tidak resmi. Seluruh penawaran tervalidasi secara deterministik pada ledger sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Card 1 */}
          <div className="p-8 bg-[#0f1115] border border-white/10 space-y-4 relative group hover:border-[#ff5500]/50 transition-colors">
            <div className="w-10 h-10 bg-white/5 border border-white/10 text-[#ff5500] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-[#5e5b54] tracking-widest uppercase">SPESIFIKASI 01</div>
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
              Audit Fisik 175 Parameter
            </h3>
            <p className="text-xs text-[#9e9a90] leading-relaxed font-body">
              Inspeksi kompresi mesin silinder, integritas apron dan pilar sasis dari benturan fatal, uji ketebalan mikron cat, serta verifikasi bebas rendaman air banjir.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-[#0f1115] border border-white/10 space-y-4 relative group hover:border-[#ff5500]/50 transition-colors">
            <div className="w-10 h-10 bg-white/5 border border-white/10 text-[#d4f728] flex items-center justify-center">
              <Disc3 className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-[#5e5b54] tracking-widest uppercase">SPESIFIKASI 02</div>
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
              Perpanjangan Anti-Sniping 120 Detik
            </h3>
            <p className="text-xs text-[#9e9a90] leading-relaxed font-body">
              Setiap tawaran yang masuk dalam rentang 120 detik terakhir otomatis memicu perpanjangan waktu 2 menit. Menghilangkan strategi bot pembeli di fraksi detik akhir.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-[#0f1115] border border-white/10 space-y-4 relative group hover:border-[#ff5500]/50 transition-colors">
            <div className="w-10 h-10 bg-white/5 border border-white/10 text-[#e5a93c] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-[#5e5b54] tracking-widest uppercase">SPESIFIKASI 03</div>
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
              Kliring Legalitas &amp; Escrow
            </h3>
            <p className="text-xs text-[#9e9a90] leading-relaxed font-body">
              Cek keabsahan nomor rangka dan mesin melalui Samsat Kepolisian. Dana deposit penawaran tersimpan di rekening escrow terpisah hingga penyerahan BPKB selesai.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
