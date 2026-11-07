import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import { Search, SlidersHorizontal, ShieldCheck, Gavel, FileText, Clock } from 'lucide-react'

export const Catalog: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [grade, setGrade] = useState(searchParams.get('grade') || '')
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '')

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (brand) params.brand = brand
      if (grade) params.grade = grade
      if (transmission) params.transmission = transmission

      const res = await api.get('/vehicles', { params })
      setVehicles(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch vehicles', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [brand, grade, transmission])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVehicles()
  }

  const formatRupiah = (val?: number) => {
    if (!val) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Telemetry */}
        <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff5500] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#ff5500]"></span>
              [ INDEKS INVENTARIS LOT // TERVERIFIKASI ]
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#e2dfd8]">
              Katalog Lelang Konsinyasi
            </h1>
            <p className="text-xs sm:text-sm text-[#9e9a90] font-body max-w-xl">
              Seluruh kendaraan telah diaudit fisik 175 parameter, bebas klaim tabrakan struktural dan bebas rendaman banjir dengan berkas BPKB terverifikasi.
            </p>
          </div>

          <div className="font-mono text-xs text-[#9e9a90] bg-[#0f1115] border border-white/10 px-4 py-2 self-start md:self-auto">
            <span>TOTAL LOT: </span>
            <span className="text-white font-bold">{vehicles.length} UNIT</span>
          </div>
        </div>

        {/* Industrial Filter & Search Bar */}
        <div className="bg-[#0f1115] border border-white/10 p-5 mb-10 space-y-4 font-mono">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pencarian kode lot, tipe, atau merek (misal: HR-V, Pajero, Innova)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#08090b] border border-white/10 text-xs text-[#e2dfd8] placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cari Lot
            </button>
          </form>

          {/* Quick Filters Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs">
            <span className="flex items-center gap-1.5 text-[#9e9a90] text-[11px] uppercase">
              <SlidersHorizontal className="w-3 h-3 text-[#ff5500]" /> Parameter:
            </span>

            {/* Brand Filter */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-1.5 bg-[#08090b] border border-white/10 text-xs text-[#e2dfd8] focus:outline-none focus:border-[#ff5500]"
            >
              <option value="">Semua Pabrikan</option>
              <option value="Honda">Honda</option>
              <option value="Toyota">Toyota</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="Hyundai">Hyundai</option>
            </select>

            {/* Grade Filter */}
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-3 py-1.5 bg-[#08090b] border border-white/10 text-xs text-[#e2dfd8] focus:outline-none focus:border-[#ff5500]"
            >
              <option value="">Semua Grade Kondisi</option>
              <option value="A">Grade A (Koleksi / Istimewa)</option>
              <option value="B">Grade B (Bagus Terawat)</option>
              <option value="C">Grade C (Wajar Pemakaian)</option>
              <option value="D">Grade D (Butuh Rekondisi)</option>
            </select>

            {/* Transmission */}
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="px-3 py-1.5 bg-[#08090b] border border-white/10 text-xs text-[#e2dfd8] focus:outline-none focus:border-[#ff5500]"
            >
              <option value="">Semua Transmisi</option>
              <option value="automatic">Automatic (AT / CVT)</option>
              <option value="manual">Manual (MT)</option>
            </select>

            {(brand || grade || transmission || search) && (
              <button
                type="button"
                onClick={() => {
                  setBrand('')
                  setGrade('')
                  setTransmission('')
                  setSearch('')
                }}
                className="text-xs text-[#ff5500] hover:underline font-bold ml-auto uppercase tracking-wider"
              >
                [ Reset Filter ]
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-[#0f1115] border border-white/10 animate-pulse p-6 space-y-4">
                <div className="h-44 bg-white/5"></div>
                <div className="h-4 bg-white/10 w-3/4"></div>
                <div className="h-4 bg-white/5 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-20 text-center border border-dashed border-white/15 bg-[#0f1115] font-mono space-y-3">
            <p className="text-sm font-bold uppercase text-[#e2dfd8] tracking-wider">
              Tidak ditemukan unit yang sesuai dengan kriteria filter.
            </p>
            <p className="text-xs text-[#9e9a90]">
              Silakan atur ulang filter pencarian untuk melihat seluruh armada lelang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {vehicles.map((vehicle) => {
              const latestAuction = vehicle.latest_auction
              const nowTime = Date.now()
              const isLive = Boolean(
                latestAuction && (
                  ['live', 'extended'].includes(latestAuction.status) ||
                  (new Date(latestAuction.start_time).getTime() <= nowTime && new Date(latestAuction.end_time).getTime() > nowTime)
                )
              )
              const isUpcoming = Boolean(
                latestAuction && !isLive && (
                  latestAuction.status === 'scheduled' ||
                  new Date(latestAuction.start_time).getTime() > nowTime
                )
              )

              return (
                <div
                  key={vehicle.id}
                  className="bg-[#0f1115] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden border-b border-white/10">
                      <img
                        src={getVehicleImageUrl(vehicle)}
                        onError={handleImageError}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale contrast-125 group-hover:grayscale-0"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 text-[10px]">
                        <span
                          className={`px-2 py-0.5 font-bold uppercase ${
                            vehicle.condition_grade === 'A'
                              ? 'bg-[#d4f728] text-black'
                              : vehicle.condition_grade === 'B'
                              ? 'bg-[#e2dfd8] text-black'
                              : 'bg-[#e5a93c] text-black'
                          }`}
                        >
                          GRADE {vehicle.condition_grade}
                        </span>
                        {isLive && (
                          <span className="px-2 py-0.5 bg-[#ff5500] text-black font-extrabold flex items-center gap-1 uppercase">
                            <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
                            LIVE
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2 py-0.5 bg-[#e5a93c] text-black font-extrabold flex items-center gap-1 uppercase">
                            TERJADWAL
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] bg-black/85 border border-white/15 text-[#9e9a90]">
                        {vehicle.license_plate}
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[10px] text-[#5e5b54] tracking-widest uppercase block mb-1">
                          LOT #{vehicle.id.toString().padStart(4, '0')} // {vehicle.brand}
                        </span>
                        <h3 className="font-display font-bold text-base text-[#e2dfd8] uppercase line-clamp-1 group-hover:text-[#ff5500] transition-colors">
                          {vehicle.title}
                        </h3>
                        <p className="text-xs text-[#9e9a90] mt-1">
                          {vehicle.year} • {vehicle.transmission} • {vehicle.mileage.toLocaleString('id-ID')} KM • {vehicle.color}
                        </p>
                      </div>

                      {/* Inspection Score Pill */}
                      {vehicle.inspection && (
                        <div className="p-2.5 bg-[#08090b] border border-white/10 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-[#9e9a90] text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#d4f728]" />
                            SKOR AUDIT 175 TITIK:
                          </span>
                          <span className="font-bold text-[#d4f728]">
                            {vehicle.inspection.overall_score}/100
                          </span>
                        </div>
                      )}

                      {/* Valuation */}
                      <div className="p-3 bg-[#08090b] border border-white/10 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-[#5e5b54] uppercase">
                            {isLive ? 'TAWARAN LIVE SAAT INI' : 'HARGA DASAR LELANG'}
                          </p>
                          <p className="text-base font-extrabold text-[#ff5500]">
                            {formatRupiah(latestAuction ? latestAuction.current_price : 0)}
                          </p>
                        </div>
                        {latestAuction && (
                          <p className="text-[11px] text-[#9e9a90]">
                            {latestAuction.total_bids} Tawaran
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex gap-2">
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[#e2dfd8] text-xs font-semibold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3 h-3 text-[#9e9a90]" />
                      Audit Fisik
                    </Link>
                    {isLive && latestAuction && (
                      <Link
                        to={`/auction/${latestAuction.id}/live`}
                        className="flex-1 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black text-xs font-bold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,85,0,0.25)]"
                      >
                        <Gavel className="w-3 h-3" />
                        Ikut Live
                      </Link>
                    )}
                    {isUpcoming && latestAuction && (
                      <Link
                        to={`/auction/${latestAuction.id}/live`}
                        className="flex-1 py-2.5 bg-white/10 hover:bg-[#ff5500] hover:text-black text-white text-xs font-bold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Clock className="w-3 h-3 text-[#e5a93c]" />
                        Ruang Tunggu
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
