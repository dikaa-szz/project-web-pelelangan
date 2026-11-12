import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Vehicle } from '../types'
import { getVehicleImageUrl, handleImageError } from '../utils/imageHelper'
import {
  Calendar,
  Car,
  Clock,
  Cog,
  FileText,
  Gauge,
  Gavel,
  Palette,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/* Constants & helpers                                                        */
/* -------------------------------------------------------------------------- */

const BRANDS = ['Honda', 'Toyota', 'Mitsubishi', 'Hyundai', 'Suzuki', 'Mazda', 'BMW', 'Mercedes-Benz']

const GRADES = [
  { value: 'A', label: 'Grade A (Koleksi / Istimewa)' },
  { value: 'B', label: 'Grade B (Bagus Terawat)' },
  { value: 'C', label: 'Grade C (Wajar Pemakaian)' },
  { value: 'D', label: 'Grade D (Butuh Rekondisi)' },
]

const TRANSMISSIONS = [
  { value: 'automatic', label: 'Automatic (AT / CVT)' },
  { value: 'manual', label: 'Manual (MT)' },
]

const TRANSMISSION_LABEL: Record<string, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
}

const SEARCH_DEBOUNCE_MS = 400

// Dibuat sekali di level modul, bukan setiap render / setiap card.
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})
const formatRupiah = (val?: number | null) => rupiahFormatter.format(val ?? 0)

type Auction = NonNullable<Vehicle['latest_auction']>
type AuctionState = 'live' | 'upcoming' | 'none'

const getAuctionState = (auction?: Auction | null, now = Date.now()): AuctionState => {
  if (!auction) return 'none'
  const start = new Date(auction.start_time).getTime()
  const end = new Date(auction.end_time).getTime()

  if (['live', 'extended'].includes(auction.status) || (start <= now && end > now)) return 'live'
  if (auction.status === 'scheduled' || start > now) return 'upcoming'
  return 'none'
}

const isAbortError = (err: unknown) =>
  (err as { code?: string; name?: string })?.code === 'ERR_CANCELED' ||
  (err as { name?: string })?.name === 'CanceledError' ||
  (err as { name?: string })?.name === 'AbortError'

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-0'

/* -------------------------------------------------------------------------- */
/* Small UI parts                                                             */
/* -------------------------------------------------------------------------- */

interface FilterSelectProps {
  label: string
  value: string
  placeholder: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, placeholder, options, onChange }) => (
  <select
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors ${focusRing}`}
  >
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)

const SpecItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1.5 min-w-0">
    <span className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</span>
    <span className="truncate">{children}</span>
  </span>
)

const VehicleCardSkeleton: React.FC = () => (
  <div
    className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse"
    aria-hidden="true"
  >
    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
      <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
    </div>
  </div>
)

/* -------------------------------------------------------------------------- */
/* Vehicle card                                                               */
/* -------------------------------------------------------------------------- */

const VehicleCard = memo(({ vehicle }: { vehicle: Vehicle }) => {
  const auction = vehicle.latest_auction
  const state = getAuctionState(auction)
  const isLive = state === 'live'
  const isUpcoming = state === 'upcoming'

  return (
    <article className="group flex flex-col h-full rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img
          src={getVehicleImageUrl(vehicle)}
          onError={handleImageError}
          alt={vehicle.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Grade {vehicle.condition_grade}
          </span>

          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] shadow-md">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              LIVE
            </span>
          )}
          {isUpcoming && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-sm">
              Terjadwal
            </span>
          )}
        </div>

        <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[11px] font-mono rounded bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
          {vehicle.license_plate}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <header className="space-y-1">
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            LOT #{String(vehicle.id).padStart(4, '0')} • {vehicle.brand}
          </p>
          <h3
            title={vehicle.title}
            className="font-bold text-base leading-snug text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {vehicle.title}
          </h3>
        </header>

        {/* Specs: grid 2 kolom agar rapi & sejajar antar card */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <SpecItem icon={<Calendar className="w-3.5 h-3.5" />}>{vehicle.year}</SpecItem>
          <SpecItem icon={<Cog className="w-3.5 h-3.5" />}>
            <span className="capitalize">{TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission}</span>
          </SpecItem>
          <SpecItem icon={<Gauge className="w-3.5 h-3.5" />}>
            {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString('id-ID')} KM` : '-'}
          </SpecItem>
          <SpecItem icon={<Palette className="w-3.5 h-3.5" />}>{vehicle.color || '-'}</SpecItem>
        </dl>

        {/* Inspection score — selalu dirender agar tinggi card konsisten */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Skor inspeksi 175 titik
          </span>
          {vehicle.inspection ? (
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {vehicle.inspection.overall_score}/100
            </span>
          ) : (
            <span className="text-slate-400">Belum ada</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {isLive ? 'Tawaran tertinggi saat ini' : 'Harga pembukaan lelang'}
            </p>
            <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 truncate">
              {formatRupiah(auction?.current_price)}
            </p>
          </div>
          {auction && (
            <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {auction.total_bids} tawaran
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-5">
        <Link
          to={`/vehicle/${vehicle.id}`}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold transition-colors ${focusRing}`}
        >
          <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          Detail &amp; Audit
        </Link>

        {auction && (isLive || isUpcoming) && (
          <Link
            to={`/auction/${auction.id}/live`}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${focusRing} ${
              isLive ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {isLive ? <Gavel className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {isLive ? 'Ikut live' : 'Ruang tunggu'}
          </Link>
        )}
      </div>
    </article>
  )
})
VehicleCard.displayName = 'VehicleCard'

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  // `searchInput` = isi textbox, `search` = query yang benar-benar dikirim ke API
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '')
  const [grade, setGrade] = useState(searchParams.get('grade') ?? '')
  const [transmission, setTransmission] = useState(searchParams.get('transmission') ?? '')

  // Debounce pencarian: tidak memanggil API di setiap ketikan.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  // Sinkronkan filter ke URL agar bisa di-share / bertahan saat refresh.
  useEffect(() => {
    const next = new URLSearchParams()
    if (search) next.set('search', search)
    if (brand) next.set('brand', brand)
    if (grade) next.set('grade', grade)
    if (transmission) next.set('transmission', transmission)
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, brand, grade, transmission])

  // Fetch dengan AbortController: mencegah race condition saat filter berubah cepat.
  useEffect(() => {
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const params: Record<string, string> = {}
        if (search) params.search = search
        if (brand) params.brand = brand
        if (grade) params.grade = grade
        if (transmission) params.transmission = transmission

        const res = await api.get('/vehicles', { params, signal: controller.signal })
        setVehicles(res.data.data ?? [])
      } catch (err) {
        if (isAbortError(err)) return
        console.error('Failed to fetch vehicles', err)
        setError('Gagal memuat daftar mobil. Periksa koneksi Anda lalu coba lagi.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [search, brand, grade, transmission, reloadKey])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim()) // langsung, tanpa menunggu debounce
  }

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setSearch('')
    setBrand('')
    setGrade('')
    setTransmission('')
  }, [])

  const hasActiveFilters = useMemo(
    () => Boolean(search || searchInput || brand || grade || transmission),
    [search, searchInput, brand, grade, transmission],
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 py-8 sm:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Katalog unit lelang resmi</p>
            <h1 className="font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Daftar Mobil Tersedia
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Seluruh kendaraan telah diaudit fisik 175 titik, bebas tabrakan struktural, bebas banjir, dan
              kelengkapan dokumen BPKB/STNK terjamin.
            </p>
          </div>

          <div
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 shadow-sm"
            aria-live="polite"
          >
            Total unit:{' '}
            <strong className="text-slate-900 dark:text-white font-bold">
              {loading ? '…' : `${vehicles.length} mobil`}
            </strong>
          </div>
        </header>

        {/* Search & filters */}
        <section
          aria-label="Pencarian dan filter"
          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
        >
          <form onSubmit={handleSearchSubmit} role="search" className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari merk, model, atau nomor plat (mis. HR-V, Fortuner)"
                aria-label="Cari unit"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors focus:border-blue-500 ${focusRing}`}
              />
            </div>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm ${focusRing}`}
            >
              Cari unit
            </button>
          </form>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Filter
            </span>

            <div className="grid grid-cols-1 min-[420px]:grid-cols-3 sm:flex gap-2.5">
              <FilterSelect
                label="Filter pabrikan"
                value={brand}
                placeholder="Semua pabrikan"
                options={BRANDS.map((b) => ({ value: b, label: b }))}
                onChange={setBrand}
              />
              <FilterSelect
                label="Filter kondisi"
                value={grade}
                placeholder="Semua kondisi"
                options={GRADES}
                onChange={setGrade}
              />
              <FilterSelect
                label="Filter transmisi"
                value={transmission}
                placeholder="Semua transmisi"
                options={TRANSMISSIONS}
                onChange={setTransmission}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className={`sm:ml-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer rounded-md px-1 ${focusRing}`}
              >
                <X className="w-4 h-4" />
                Reset filter
              </button>
            )}
          </div>
        </section>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label="Memuat">
            {Array.from({ length: 6 }, (_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-rose-300 dark:border-rose-900/60 bg-white dark:bg-[#0f172a] space-y-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold cursor-pointer ${focusRing}`}
            >
              <RefreshCw className="w-4 h-4" />
              Coba lagi
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 sm:p-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <Car className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Tidak ada unit yang sesuai kriteria pencarian.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ubah kata kunci atau reset filter untuk melihat seluruh unit lelang.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className={`mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold cursor-pointer ${focusRing}`}
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog