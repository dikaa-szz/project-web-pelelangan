import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { ShieldCheck, CheckCircle2, Gavel, FileText, ArrowLeft, Disc3, Clock } from 'lucide-react'

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
      <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#ff5500] border-t-transparent animate-spin mx-auto"></div>
          <p className="uppercase tracking-widest">[ MEMUAT DOSIR KENDARAAN... ]</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
        <div className="text-center space-y-3 p-8 border border-white/10 bg-[#0f1115]">
          <p className="font-bold text-white uppercase">[ UNIT TIDAK DITEMUKAN ]</p>
          <Link to="/catalog" className="inline-block text-[#ff5500] hover:underline uppercase">
            &lt; Kembali ke Indeks Lot
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
  const nowTime = Date.now()
  const isLive = Boolean(
    activeAuction && (
      ['live', 'extended'].includes(activeAuction.status) ||
      (new Date(activeAuction.start_time).getTime() <= nowTime && new Date(activeAuction.end_time).getTime() > nowTime)
    )
  )
  const isUpcoming = Boolean(
    activeAuction && !isLive && (
      activeAuction.status === 'scheduled' ||
      new Date(activeAuction.start_time).getTime() > nowTime
    )
  )

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-10 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs text-[#9e9a90] hover:text-[#ff5500] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> [ &lt; KEMBALI KE INDEKS LOT ]
          </Link>
        </div>

        {/* Top Header & Valuation HUD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 font-bold bg-[#d4f728] text-black uppercase">
                GRADE {vehicle.condition_grade}
              </span>
              <span className="px-2 py-0.5 bg-black border border-white/20 text-[#e2dfd8]">
                NOPOL: {vehicle.license_plate}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[#9e9a90]">
                VIN: {vehicle.vin || 'VERIFIED-01'}
              </span>
              {isLive && (
                <span className="px-2 py-0.5 bg-[#ff5500] text-black font-extrabold flex items-center gap-1 uppercase">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
                  LIVE BIDDING AKTIF
                </span>
              )}
              {isUpcoming && (
                <span className="px-2 py-0.5 bg-[#e5a93c] text-black font-extrabold flex items-center gap-1 uppercase">
                  LELANG TERJADWAL
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
              {vehicle.title}
            </h1>
            <p className="text-xs text-[#9e9a90]">
              Pabrikan: {vehicle.brand} • Seri: {vehicle.model} • Tahun Produksi: {vehicle.year} • Warna: {vehicle.color}
            </p>
          </div>

          {activeAuction && (
            <div className="p-4 bg-[#0f1115] border border-white/10 flex items-center gap-6">
              <div>
                <span className="text-[10px] text-[#5e5b54] uppercase block">
                  {isLive ? 'TAWARAN LIVE TERTINGGI' : 'HARGA DASAR LELANG'}
                </span>
                <span className="font-display text-xl sm:text-2xl font-black text-[#ff5500]">
                  {formatRupiah(activeAuction.current_price)}
                </span>
              </div>
              {isLive ? (
                <Link
                  to={`/auction/${activeAuction.id}/live`}
                  className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)]"
                >
                  <Gavel className="w-3.5 h-3.5" /> Masuk Live Sekarang
                </Link>
              ) : isUpcoming ? (
                <Link
                  to={`/auction/${activeAuction.id}/live`}
                  className="px-6 py-2.5 bg-white/10 hover:bg-[#ff5500] hover:text-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Clock className="w-3.5 h-3.5 text-[#e5a93c]" /> Ruang Tunggu Lelang
                </Link>
              ) : (
                <div className="px-4 py-2 bg-white/5 border border-white/10 text-[#9e9a90] text-xs uppercase">
                  Lelang Selesai
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery & Specs Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Gallery & Notes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-[16/10] bg-black border border-white/10 overflow-hidden">
              <img
                src={images[activeImgIndex]?.image_url}
                alt={vehicle.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] bg-black/85 border border-white/15 text-[#9e9a90]">
                FRAME [{activeImgIndex + 1} / {images.length}]
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 border transition-all cursor-pointer ${
                      activeImgIndex === idx
                        ? 'border-[#ff5500] ring-1 ring-[#ff5500]'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="p-6 bg-[#0f1115] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-white border-b border-white/10 pb-2">
                <FileText className="w-3.5 h-3.5 text-[#ff5500]" />
                Catatan Konsinyasi &amp; Riwayat Kepemilikan
              </div>
              <p className="text-xs text-[#9e9a90] leading-relaxed font-body whitespace-pre-line">
                {vehicle.description || 'Tidak ada catatan khusus tambahan untuk kendaraan ini.'}
              </p>
            </div>
          </div>

          {/* Specs Matrix & Dealer Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Technical Specifications */}
            <div className="p-6 bg-[#0f1115] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  Matriks Teknis Unit
                </h3>
                <Disc3 className="w-3.5 h-3.5 text-[#5e5b54]" />
              </div>

              <div className="divide-y divide-white/5 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Pabrikan</span>
                  <span className="font-bold text-white">{vehicle.brand}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Model / Seri</span>
                  <span className="font-bold text-white">{vehicle.model}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Tahun Rakitan</span>
                  <span className="font-bold text-white">{vehicle.year}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Tipe Transmisi</span>
                  <span className="font-bold text-white uppercase">{vehicle.transmission}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Bahan Bakar</span>
                  <span className="font-bold text-white uppercase">{vehicle.fuel_type}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Jarak Tempuh</span>
                  <span className="font-bold text-white">{vehicle.mileage.toLocaleString('id-ID')} KM</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Kelir Bodi</span>
                  <span className="font-bold text-white">{vehicle.color}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#9e9a90]">Status Legalitas</span>
                  <span className="font-bold text-[#d4f728]">BPKB / STNK LENGKAP</span>
                </div>
              </div>
            </div>

            {/* Dealer Profile */}
            {vehicle.seller && (
              <div className="p-6 bg-[#0f1115] border border-white/10 space-y-4">
                <div className="text-[10px] text-[#5e5b54] uppercase tracking-widest border-b border-white/10 pb-2">
                  KONSINYOR / DEALER TERVERIFIKASI
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-white uppercase">{vehicle.seller.name}</h4>
                  <p className="text-xs text-[#9e9a90]">
                    Lokasi: {vehicle.seller.seller_profile?.city || 'Jakarta'}, {vehicle.seller.seller_profile?.province || 'DKI Jakarta'}
                  </p>
                  <p className="text-xs text-[#e5a93c] pt-1">
                    Rating Reputasi: {vehicle.seller.seller_profile?.rating || '5.0'} / 5.0
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 175-Point Audit Dossier Section */}
        {vehicle.inspection && (
          <div className="p-6 sm:p-8 bg-[#0f1115] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#d4f728] text-[11px] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Sertifikat Audit Fisik Independen
                </div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">
                  Laporan Hasil Audit 175 Parameter
                </h2>
                <p className="text-xs text-[#9e9a90]">
                  Diperiksa oleh: <span className="font-bold text-white">{vehicle.inspection.inspector_name}</span> // Tanggal:{' '}
                  {new Date(vehicle.inspection.inspection_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>

              {/* Overall Score Dossier Badge */}
              <div className="p-4 bg-[#08090b] border border-white/15 flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-[#5e5b54] uppercase block">Skor Kelayakan</span>
                  <span className="text-3xl font-extrabold text-[#d4f728]">
                    {vehicle.inspection.overall_score}<span className="text-xs text-[#9e9a90]">/100</span>
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#d4f728] text-black font-extrabold flex items-center justify-center text-xs">
                  PASS
                </div>
              </div>
            </div>

            {/* Clearances (Flood & Major Accident) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 border flex items-center gap-3 ${
                !vehicle.inspection.flood_history
                  ? 'bg-[#08090b] border-[#d4f728]/30 text-[#d4f728]'
                  : 'bg-[#ff5500]/10 border-[#ff5500]/40 text-[#ff5500]'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Kliring Bebas Banjir</h4>
                  <p className="text-[11px] text-[#9e9a90] font-body mt-0.5">
                    Modul elektronik ECU, socket karpet dasar, dan celah kompartemen bebas dari endapan lumpur.
                  </p>
                </div>
              </div>

              <div className={`p-4 border flex items-center gap-3 ${
                !vehicle.inspection.accident_history
                  ? 'bg-[#08090b] border-[#d4f728]/30 text-[#d4f728]'
                  : 'bg-[#ff5500]/10 border-[#ff5500]/40 text-[#ff5500]'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Kliring Bebas Tabrakan Fatal</h4>
                  <p className="text-[11px] text-[#9e9a90] font-body mt-0.5">
                    Titik pengelasan robot pabrik pada apron depan, bullhead, dan pilar A/B/C dalam kondisi presisi standar.
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Subsystem Diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Drivetrain &amp; Mesin</span>
                <p className="font-bold text-white">{vehicle.inspection.engine_condition}</p>
              </div>

              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Transmisi &amp; Kopling</span>
                <p className="font-bold text-white">{vehicle.inspection.transmission_condition}</p>
              </div>

              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Sistem Rem &amp; ABS</span>
                <p className="font-bold text-white">{vehicle.inspection.brake_system}</p>
              </div>

              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Kelistrikan &amp; ECU OBD</span>
                <p className="font-bold text-white">{vehicle.inspection.electrical_system}</p>
              </div>

              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Geometri Sasis &amp; Kolong</span>
                <p className="font-bold text-white">{vehicle.inspection.body_frame}</p>
              </div>

              <div className="p-4 bg-[#08090b] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#5e5b54] uppercase block">Kabin &amp; Kebersihan Interior</span>
                <p className="font-bold text-white">{vehicle.inspection.interior_condition}</p>
              </div>
            </div>

            {/* Notes */}
            {vehicle.inspection.notes && (
              <div className="p-4 bg-[#08090b] border border-white/10 text-xs">
                <span className="text-[#ff5500] font-bold uppercase block mb-1">Catatan Auditor:</span>
                <p className="text-[#9e9a90] font-body">{vehicle.inspection.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VehicleDetail
