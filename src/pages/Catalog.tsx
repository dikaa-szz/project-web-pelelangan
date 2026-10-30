import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { Search, SlidersHorizontal, ShieldCheck } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Katalog Mobil Lelang</h1>
          <p className="text-sm text-slate-400 mt-1">
            Temukan mobil bekas tersertifikasi siap lelang dengan laporan inspeksi lengkap dan legalitas terjamin.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan merek atau tipe (misal: Honda HR-V, Innova Zenix)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Cari
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Cepat:
            </span>

            {/* Brand Filter */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Semua Merek</option>
              <option value="Honda">Honda</option>
              <option value="Toyota">Toyota</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="Hyundai">Hyundai</option>
            </select>

            {/* Grade Filter */}
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Semua Grade Kondisi</option>
              <option value="A">Grade A (Sangat Istimewa)</option>
              <option value="B">Grade B (Bagus Terawat)</option>
              <option value="C">Grade C (Wajar Pemakaian)</option>
              <option value="D">Grade D (Butuh Rekondisi)</option>
            </select>

            {/* Transmission */}
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
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
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-auto"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <p className="text-lg font-bold text-slate-300">Tidak ada mobil yang sesuai dengan filter.</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const latestAuction = vehicle.latest_auction
              const isLive = latestAuction && ['live', 'extended'].includes(latestAuction.status)

              return (
                <div
                  key={vehicle.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all shadow-md group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-56 bg-slate-950 overflow-hidden">
                      <img
                        src={
                          vehicle.primary_image?.image_url ||
                          'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md ${
                            vehicle.condition_grade === 'A'
                              ? 'bg-emerald-600 text-white'
                              : vehicle.condition_grade === 'B'
                              ? 'bg-blue-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          Grade {vehicle.condition_grade}
                        </span>
                        {isLive && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            LIVE BIDDING
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 backdrop-blur-sm text-slate-300">
                        {vehicle.license_plate}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {vehicle.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Tahun {vehicle.year} • {vehicle.transmission} • {vehicle.mileage.toLocaleString('id-ID')} km • {vehicle.color}
                        </p>
                      </div>

                      {/* Inspection Score pill */}
                      {vehicle.inspection && (
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Skor Inspeksi:
                          </span>
                          <span className="font-extrabold text-emerald-400">
                            {vehicle.inspection.overall_score}/100
                          </span>
                        </div>
                      )}

                      {/* Pricing Info */}
                      <div className="pt-2 border-t border-slate-800 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">
                            {isLive ? 'Harga Live Saat Ini' : 'Harga Dasar Lelang'}
                          </p>
                          <p className="text-lg font-black text-blue-400">
                            {formatRupiah(latestAuction ? latestAuction.current_price : 0)}
                          </p>
                        </div>
                        {latestAuction && (
                          <p className="text-xs text-slate-400">
                            {latestAuction.total_bids} Tawaran
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-5 pt-0 flex gap-2">
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="flex-1 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold text-center transition-colors"
                    >
                      Detail & Inspeksi
                    </Link>
                    {isLive && (
                      <Link
                        to={`/auction/${latestAuction.id}/live`}
                        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold text-center transition-colors shadow-md shadow-red-600/20"
                      >
                        Ikut Live
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
