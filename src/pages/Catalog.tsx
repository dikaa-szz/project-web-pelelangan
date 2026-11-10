import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import { Search, SlidersHorizontal, ShieldCheck, Gavel, FileText, Clock, Car, Star, X } from 'lucide-react'

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

  const hasActiveFilters = Boolean(brand || grade || transmission || search)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Katalog Unit Lelang Resmi
            </span>
            <h1 className="font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Daftar Mobil Tersedia
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Seluruh kendaraan telah diaudit fisik 175 titik, bebas tabrakan struktural, bebas banjir, dan kelengkapan dokumen BPKB/STNK terjamin.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 self-start md:self-auto shadow-sm">
            <span>Total Unit: </span>
            <strong className="text-slate-900 dark:text-white font-bold">{vehicles.length} Mobil</strong>
          </div>
        </div>

        {/* Filter & Search Panel */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan merk, model, atau nomor plat (misal: HR-V, Fortuner, Avanza)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Cari Unit
            </button>
          </form>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Filter:
            </span>

            {/* Brand Filter */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Semua Pabrikan</option>
              <option value="Honda">Honda</option>
              <option value="Toyota">Toyota</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Suzuki">Suzuki</option>
              <option value="Mazda">Mazda</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
            </select>

            {/* Grade Filter */}
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Semua Kondisi</option>
              <option value="A">Grade A (Koleksi / Istimewa)</option>
              <option value="B">Grade B (Bagus Terawat)</option>
              <option value="C">Grade C (Wajar Pemakaian)</option>
              <option value="D">Grade D (Butuh Rekondisi)</option>
            </select>

            {/* Transmission */}
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Semua Transmisi</option>
              <option value="automatic">Automatic (AT / CVT)</option>
              <option value="manual">Manual (MT)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setBrand('')
                  setGrade('')
                  setTransmission('')
                  setSearch('')
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 ml-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 animate-pulse p-5 space-y-4 shadow-sm">
                <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                <div className="h-5 rounded bg-slate-200 dark:bg-slate-800 w-3/4"></div>
                <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/60 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <Car className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Tidak ditemukan unit mobil yang sesuai kriteria pencarian.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coba atur ulang kata kunci atau filter untuk melihat seluruh armada lelang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between group overflow-hidden shadow-sm"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                      <img
                        src={getVehicleImageUrl(vehicle)}
                        onError={handleImageError}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          GRADE {vehicle.condition_grade}
                        </span>
                        {isLive && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 uppercase shadow-md">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            LIVE
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase shadow-sm">
                            TERJADWAL
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-mono rounded bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
                        {vehicle.license_plate}
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="p-5 space-y-3.5">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase block mb-0.5">
                          LOT #{vehicle.id.toString().padStart(4, '0')} • {vehicle.brand}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {vehicle.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {vehicle.year} • {vehicle.transmission} • {vehicle.mileage?.toLocaleString('id-ID')} KM • {vehicle.color}
                        </p>
                      </div>

                      {/* Inspection Score Pill */}
                      {vehicle.inspection && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Skor Inspeksi 175 Titik:
                          </span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {vehicle.inspection.overall_score}/100
                          </span>
                        </div>
                      )}

                      {/* Valuation */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">
                            {isLive ? 'Tawaran Tertinggi Saat Ini' : 'Harga Pembukaan Lelang'}
                          </p>
                          <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                            {formatRupiah(latestAuction ? latestAuction.current_price : 0)}
                          </p>
                        </div>
                        {latestAuction && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {latestAuction.total_bids} Tawaran
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex gap-2">
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Detail &amp; Audit
                    </Link>
                    {isLive && latestAuction && (
                      <Link
                        to={`/auction/${latestAuction.id}/live`}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        Ikut Live
                      </Link>
                    )}
                    {isUpcoming && latestAuction && (
                      <Link
                        to={`/auction/${latestAuction.id}/live`}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5" />
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