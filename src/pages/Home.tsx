import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Auction } from '../types'
import { Gavel, Clock, ArrowRight, ShieldCheck, Award, Zap, ChevronRight } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Sistem Lelang Mobil Bekas Live Real-Time Terpercaya
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Lelang Mobil Bekas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Transparan & Real-Time
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Ikuti penawaran mobil berkualitas secara live dengan sistem WebSocket instan, proteksi anti-sniping, jaminan kondisi inspeksi 175 titik, dan kepastian legalitas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/catalog"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                Jelajahi Katalog Mobil
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/live"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Ruang Lelang Live
              </Link>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-1">Transparan Real-Time</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">175 Titik</p>
                <p className="text-xs text-slate-400 mt-1">Inspeksi Standar</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 100ms</p>
                <p className="text-xs text-slate-400 mt-1">Latensi WebSocket</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">0%</p>
                <p className="text-xs text-slate-400 mt-1">Manipulasi Harga</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              Sesi Sedang Berlangsung
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Lelang Live Real-Time</h2>
          </div>
          <Link
            to="/catalog?status=live"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            Lihat Semua Live <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : liveAuctions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Saat ini tidak ada sesi lelang yang sedang live.</p>
            <p className="text-xs text-slate-500 mt-1">Silakan pantau jadwal lelang mendatang di bawah.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  <img
                    src={
                      auction.vehicle?.primary_image?.image_url ||
                      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/90 text-blue-400 border border-slate-700">
                      Grade {auction.vehicle?.condition_grade || 'A'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-slate-900/80 backdrop-blur-sm text-slate-300 border border-slate-700">
                    {auction.total_bids} Penawaran
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {auction.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {auction.vehicle?.year} • {auction.vehicle?.transmission} • {auction.vehicle?.mileage.toLocaleString('id-ID')} km
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Tawaran Tertinggi Saat Ini</p>
                      <p className="text-lg font-black text-blue-400">
                        {formatRupiah(auction.current_price)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/auction/${auction.id}/live`}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Gavel className="w-4 h-4" />
                    Masuk Ruang Lelang Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Auctions Section */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Jadwal Sesi Mendatang</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Lelang Terjadwal</h2>
            </div>
            <Link to="/catalog" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
              Lihat Kalender
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledAuctions.map((auction) => (
              <div
                key={auction.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Mulai:{' '}
                    {new Date(auction.start_time).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Grade {auction.vehicle?.condition_grade || 'A'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base line-clamp-1">{auction.title}</h3>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Harga Pembukaan</p>
                    <p className="text-sm font-bold text-white">{formatRupiah(auction.start_price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Kelipatan Bid</p>
                    <p className="text-xs font-semibold text-slate-300">+{formatRupiah(auction.bid_increment)}</p>
                  </div>
                </div>

                <Link
                  to={`/vehicle/${auction.vehicle_id}`}
                  className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  Lihat Detail Unit & Hasil Inspeksi
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights / Trust Badges */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black text-white">Mengapa Memilih AutoBid?</h2>
          <p className="text-slate-400 text-sm">
            Standar profesionalisme lelang mobil yang dirancang untuk keamanan pembeli dan kenyamanan penjual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Inspeksi Ketat 175 Titik</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Setiap mobil dicek langsung oleh inspektur independen: kondisi kompresi mesin, transmisi, sasis, riwayat bebas banjir, dan keaslian dokumen legalitas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Bidding WebSocket</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Setiap tawaran yang masuk langsung didistribusikan ke layar semua peserta dalam hitungan milidetik tanpa perlu refresh manual.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Sistem Anti-Sniping & Anti-Bot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Penawaran di detik terakhir akan otomatis memperpanjang durasi lelang selama 2 menit, memberi kesempatan adil bagi peserta asli tanpa takut bot sniping.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home
