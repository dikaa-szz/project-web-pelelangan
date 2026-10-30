import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { ShieldCheck, CheckCircle2, Gavel, FileText, ArrowLeft } from 'lucide-react'

export const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`)
        setVehicle(res.data)
      } catch (err) {
        console.error('Failed to fetch vehicle', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm">Memuat detail kendaraan...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-white">Kendaraan tidak ditemukan</p>
          <Link to="/catalog" className="text-sm text-blue-400 hover:underline">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    )
  }

  const formatRupiah = (val?: number) => {
    if (!val) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : vehicle.primary_image
    ? [vehicle.primary_image]
    : [{ id: 0, vehicle_id: vehicle.id, image_url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80', is_primary: true, order: 0 }]

  const activeAuction = vehicle.latest_auction
  const isLive = activeAuction && ['live', 'extended'].includes(activeAuction.status)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog Mobil
          </Link>
        </div>

        {/* Top Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-600 text-white">
                Grade {vehicle.condition_grade}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Plat: {vehicle.license_plate}
              </span>
              {isLive && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-red-600 text-white flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  SEDANG LIVE
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{vehicle.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {vehicle.brand} • {vehicle.model} • Tahun {vehicle.year} • {vehicle.color}
            </p>
          </div>

          {activeAuction && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-6">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">
                  {isLive ? 'Harga Live Terkini' : 'Harga Dasar'}
                </p>
                <p className="text-xl sm:text-2xl font-black text-blue-400">
                  {formatRupiah(activeAuction.current_price)}
                </p>
              </div>
              {isLive ? (
                <Link
                  to={`/auction/${activeAuction.id}/live`}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <Gavel className="w-4 h-4" /> Masuk Ruang Lelang
                </Link>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700 cursor-not-allowed"
                >
                  Lelang Terjadwal
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gallery & Quick Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-[340px] sm:h-[480px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <img
                src={images[activeImgIndex]?.image_url}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md text-xs font-semibold bg-slate-950/80 backdrop-blur-sm text-white">
                Foto {activeImgIndex + 1} dari {images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImgIndex === idx ? 'border-blue-500 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Deskripsi Kendaraan */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Deskripsi & Catatan Penjual
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {vehicle.description || 'Tidak ada catatan tambahan untuk kendaraan ini.'}
              </p>
            </div>
          </div>

          {/* Quick Specs & Seller Card */}
          <div className="space-y-6">
            {/* Spesifikasi Teknis */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Spesifikasi Kendaraan</h3>
              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Merek / Model</span>
                  <span className="font-semibold text-white">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Tahun Produksi</span>
                  <span className="font-semibold text-white">{vehicle.year}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Transmisi</span>
                  <span className="font-semibold text-white capitalize">{vehicle.transmission}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Bahan Bakar</span>
                  <span className="font-semibold text-white capitalize">{vehicle.fuel_type}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Odometer</span>
                  <span className="font-semibold text-white">{vehicle.mileage.toLocaleString('id-ID')} km</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Warna Bodi</span>
                  <span className="font-semibold text-white">{vehicle.color}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Nomor Rangka (VIN)</span>
                  <span className="font-mono text-slate-300">{vehicle.vin || 'Tersedia'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Dokumen BPKB</span>
                  <span className="font-semibold text-emerald-400">Lengkap & Sah</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {vehicle.seller && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    {vehicle.seller.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{vehicle.seller.name}</h4>
                    <p className="text-xs text-slate-400">Dealer Terverifikasi AutoBid</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                  <p>📍 {vehicle.seller.seller_profile?.city || 'Jakarta'}, {vehicle.seller.seller_profile?.province || 'DKI Jakarta'}</p>
                  <p>⭐ Rating Dealer: <span className="text-amber-400 font-bold">{vehicle.seller.seller_profile?.rating || '5.0'} / 5.0</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 175-Point Inspection Report Section */}
        {vehicle.inspection && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" /> Hasil Sertifikasi Resmi AutoBid
                </div>
                <h2 className="text-2xl font-black text-white">Laporan Inspeksi 175 Titik</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Diperiksa oleh: <span className="font-semibold text-white">{vehicle.inspection.inspector_name}</span> pada{' '}
                  {new Date(vehicle.inspection.inspection_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>

              {/* Overall Score Circle */}
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Skor Keseluruhan</p>
                  <p className="text-2xl font-black text-emerald-400">{vehicle.inspection.overall_score}/100</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Integrity Guarantees (Bebas Banjir & Bebas Tabrak) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                !vehicle.inspection.flood_history
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Bebas Indikasi Banjir</h4>
                  <p className="text-xs opacity-80">Tidak ditemukan korosi atau endapan lumpur pada modul ECU dan sasis.</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                !vehicle.inspection.accident_history
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Bebas Tabrakan Besar</h4>
                  <p className="text-xs opacity-80">Tulang apron depan, pilar pintu, dan lantai bagasi belakang dalam kondisi utuh original.</p>
                </div>
              </div>
            </div>

            {/* Inspection Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Kondisi Mesin</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.engine_condition}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Transmisi & Kopling</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.transmission_condition}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Sistem Pengereman</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.brake_system}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Kelistrikan & Komputer</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.electrical_system}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Bodi & Sasis Tulang</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.body_frame}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Interior & Kabin</span>
                <p className="text-sm font-semibold text-white">{vehicle.inspection.interior_condition}</p>
              </div>
            </div>

            {/* Inspector Notes */}
            {vehicle.inspection.notes && (
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-slate-300 text-xs">
                <span className="font-bold text-blue-400 block mb-1">Catatan Khusus Inspektur:</span>
                {vehicle.inspection.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default VehicleDetail
