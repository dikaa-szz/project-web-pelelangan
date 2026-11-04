import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { AdminLayout } from '../components/layout/AdminLayout'
import { 
  Users, 
  Car, 
  Gavel, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  X,
  Star,
  Link as LinkIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

export const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview')
  const [stats, setStats] = useState<any>(null)
  const [pendingVehicles, setPendingVehicles] = useState<any[]>([])
  const [approvedVehicles, setApprovedVehicles] = useState<any[]>([])
  const [liveAuctions, setLiveAuctions] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form State for creating new auction
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const [auctionTitle, setAuctionTitle] = useState<string>('')
  const [startPrice, setStartPrice] = useState<string>('')
  const [bidIncrement, setBidIncrement] = useState<string>('500000')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [isCreatingAuction, setIsCreatingAuction] = useState(false)

  // Form State for creating new vehicle
  const [vehTitle, setVehTitle] = useState<string>('')
  const [vehBrand, setVehBrand] = useState<string>('Honda')
  const [vehModel, setVehModel] = useState<string>('')
  const [vehYear, setVehYear] = useState<string>('2023')
  const [vehTransmission, setVehTransmission] = useState<string>('automatic')
  const [vehFuel, setVehFuel] = useState<string>('bensin')
  const [vehMileage, setVehMileage] = useState<string>('25000')
  const [vehColor, setVehColor] = useState<string>('Hitam Metalik')
  const [vehPlate, setVehPlate] = useState<string>('')
  const [vehVin, setVehVin] = useState<string>('')
  const [vehEngine, setVehEngine] = useState<string>('')
  const [vehBpkb, setVehBpkb] = useState<string>('')
  const [vehGrade, setVehGrade] = useState<string>('A')
  const [vehScore, setVehScore] = useState<string>('95')
  const [vehSellerId, setVehSellerId] = useState<string>('')
  const [vehImageUrl, setVehImageUrl] = useState<string>('')
  const [vehDesc, setVehDesc] = useState<string>('')
  const [isSubmittingVeh, setIsSubmittingVeh] = useState(false)
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload')
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      if (files.length === 1) {
        formData.append('image', files[0])
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append('images[]', files[i])
        }
      }

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data.images) {
        const urls = res.data.images.map((img: any) => img.url)
        setUploadedPhotos((prev) => [...prev, ...urls])
        toast.success(`${urls.length} foto berhasil diunggah dari perangkat!`)
      } else if (res.data.url) {
        setUploadedPhotos((prev) => [...prev, res.data.url])
        toast.success('Foto berhasil diunggah dari perangkat!')
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengunggah berkas gambar.'
      toast.error(msg)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = (indexToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSetPrimaryPhoto = (indexToPrimary: number) => {
    setUploadedPhotos((prev) => {
      const item = prev[indexToPrimary]
      const rest = prev.filter((_, idx) => idx !== indexToPrimary)
      return [item, ...rest]
    })
  }

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [statsRes, pendingRes, auctionsRes, usersRes, approvedRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/vehicles/pending'),
        api.get('/auctions?status=live'),
        api.get('/admin/users'),
        api.get('/admin/vehicles/approved'),
      ])
      setStats(statsRes.data)
      setPendingVehicles(pendingRes.data || [])
      setLiveAuctions(auctionsRes.data.data || [])
      setUsersList(usersRes.data || [])
      setApprovedVehicles(approvedRes.data || [])
    } catch (err) {
      console.error('Failed to fetch admin data', err)
      toast.error('Gagal mengambil data backoffice admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleApprove = async (vehicleId: number) => {
    try {
      await api.post(`/admin/vehicles/${vehicleId}/approve`)
      toast.success('Unit kendaraan berhasil disetujui untuk lelang!')
      fetchAdminData()
    } catch {
      toast.error('Gagal menyetujui kendaraan.')
    }
  }

  const handleFinalize = async (auctionId: number) => {
    try {
      const res = await api.post(`/admin/auctions/${auctionId}/finalize`)
      toast.success(res.data.message || 'Sesi lelang berhasil difinalisasi!')
      fetchAdminData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal finalisasi lelang.')
    }
  }

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleId) {
      toast.error('Pilih unit kendaraan terlebih dahulu.')
      return
    }

    setIsCreatingAuction(true)
    try {
      await api.post('/admin/auctions', {
        vehicle_id: selectedVehicleId,
        title: auctionTitle,
        start_price: Number(startPrice),
        bid_increment: Number(bidIncrement),
        start_time: startTime,
        end_time: endTime,
        auto_extension_threshold: 120,
        auto_extension_duration: 120,
        max_extensions: 5,
      })

      toast.success('Sesi lelang baru berhasil dijadwalkan!')
      // Reset form
      setSelectedVehicleId('')
      setAuctionTitle('')
      setStartPrice('')
      setStartTime('')
      setEndTime('')
      setCurrentTab('auctions')
      fetchAdminData()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal membuat sesi lelang.'
      toast.error(msg)
    } finally {
      setIsCreatingAuction(false)
    }
  }

  // Handle vehicle registration
  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingVeh(true)

    try {
      const payload: any = {
        title: vehTitle,
        brand: vehBrand,
        model: vehModel,
        year: Number(vehYear),
        transmission: vehTransmission,
        fuel_type: vehFuel,
        mileage: Number(vehMileage),
        color: vehColor,
        license_plate: vehPlate.toUpperCase(),
        vin: vehVin || `MHK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        engine_number: vehEngine || `ENG-${Math.floor(Math.random() * 899999 + 100000)}`,
        bpkb_number: vehBpkb || `BPKB-${Math.floor(Math.random() * 899999 + 100000)}`,
        condition_grade: vehGrade,
        description: vehDesc,
        seller_id: vehSellerId ? Number(vehSellerId) : undefined,
        images: uploadedPhotos.length > 0
          ? uploadedPhotos.map((url, idx) => ({ url, is_primary: idx === 0 }))
          : [
              {
                url: vehImageUrl || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
                is_primary: true,
              },
            ],
        inspection: {
          overall_score: Number(vehScore),
          inspector_name: 'Biro Audit AutoBid Resmi',
          flood_history: false,
          accident_history: false,
          notes: 'Unit telah melewati audit 175 titik, hasil scanner OBD normal, bebas benturan fatal dan bebas banjir.',
        },
      }

      await api.post('/vehicles', payload)
      toast.success('Unit mobil berhasil didaftarkan dan langsung disetujui (Approved)!')

      // Reset vehicle form
      setVehTitle('')
      setVehModel('')
      setVehPlate('')
      setVehDesc('')
      setVehImageUrl('')
      setUploadedPhotos([])

      // Refresh admin data and switch to schedule auction
      await fetchAdminData()
      setCurrentTab('create-auction')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.license_plate?.[0] || 'Gagal mendaftarkan unit mobil.'
      toast.error(msg)
    } finally {
      setIsSubmittingVeh(false)
    }
  }

  // Preset Auto-fill Helper for Quick Testing
  const applyPreset = (presetName: string) => {
    const randomSuffix = Math.floor(Math.random() * 899 + 100)
    if (presetName === 'civic') {
      setVehTitle('Honda Civic Type R 2.0 Turbo MT')
      setVehBrand('Honda')
      setVehModel('Civic Type R')
      setVehYear('2024')
      setVehTransmission('manual')
      setVehFuel('bensin')
      setVehMileage('4200')
      setVehColor('Championship White')
      setVehPlate(`B ${randomSuffix} VIX`)
      setVehGrade('A')
      setVehScore('98')
      setVehImageUrl('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80')
      setUploadedPhotos(['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'])
      setVehDesc('Unit simpanan kondisi seperti baru, odometer rendah 4.200 KM, cat full original, exhaust original Brembo brakes.')
    } else if (presetName === 'fortuner') {
      setVehTitle('Toyota Fortuner 2.8 GR Sport 4x4 AT')
      setVehBrand('Toyota')
      setVehModel('Fortuner GR Sport')
      setVehYear('2023')
      setVehTransmission('automatic')
      setVehFuel('diesel')
      setVehMileage('18500')
      setVehColor('Super White')
      setVehPlate(`B ${randomSuffix} GR`)
      setVehGrade('A')
      setVehScore('96')
      setVehImageUrl('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80')
      setUploadedPhotos(['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'])
      setVehDesc('Tipe tertinggi 2.8 GR Sport 4x4, rawatan bengkel resmi Toyota, pajak hidup, kaki-kaki senyap.')
    } else if (presetName === 'ioniq') {
      setVehTitle('Hyundai Ioniq 5 Signature Long Range EV')
      setVehBrand('Hyundai')
      setVehModel('Ioniq 5')
      setVehYear('2023')
      setVehTransmission('automatic')
      setVehFuel('listrik')
      setVehMileage('12000')
      setVehColor('Gravity Gold Matte')
      setVehPlate(`B ${randomSuffix} ION`)
      setVehGrade('A')
      setVehScore('97')
      setVehImageUrl('https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80')
      setUploadedPhotos(['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'])
      setVehDesc('Kendaraan listrik murni, Battery Health 99%, garansi baterai resmi aktif hingga 2031, V2L adapter lengkap.')
    } else if (presetName === 'pajero') {
      setVehTitle('Mitsubishi Pajero Sport Dakar Ultimate 4x2')
      setVehBrand('Mitsubishi')
      setVehModel('Pajero Sport Dakar')
      setVehYear('2022')
      setVehTransmission('automatic')
      setVehFuel('diesel')
      setVehMileage('34000')
      setVehColor('Deep Bronze Metallic')
      setVehPlate(`B ${randomSuffix} DKR`)
      setVehGrade('B')
      setVehScore('89')
      setVehImageUrl('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80')
      setUploadedPhotos(['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'])
      setVehDesc('Pajero Sport Dakar pemakaian pribadi terawat, sunroof elektrik aktif, buku servis dan kunci serep lengkap.')
    }
  }

  const formatRupiah = (val?: number) => {
    if (!val) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Filter sellers for the dropdown
  const sellerUsers = usersList.filter((u) => u.role === 'seller' || u.role === 'admin')

  return (
    <AdminLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      pendingCount={pendingVehicles.length}
      liveCount={liveAuctions.length}
    >
      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Metric Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
                Ikhtisar Sistem &amp; Telemetri Operasional
              </h2>
              <p className="text-xs text-[#9e9a90] mt-1">
                Data real-time volume lelang, kliring GMV, dan antrean verifikasi konsinyasi.
              </p>
            </div>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase text-[#e2dfd8] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#d4f728] ${loading ? 'animate-spin' : ''}`} />
              Sinkronkan Ulang
            </button>
          </div>

          {/* KPI Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0a0c10] border border-white/10 space-y-2">
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#d4f728]" />
                TOTAL GMV KONSINYASI
              </span>
              <p className="font-display text-2xl font-black text-[#d4f728]">
                {formatRupiah(stats?.total_gmv || 0)}
              </p>
              <p className="text-[10px] text-[#9e9a90]">Akumulasi lot terbayar lunas</p>
            </div>

            <div className="p-5 bg-[#0a0c10] border border-white/10 space-y-2">
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider flex items-center gap-2">
                <Gavel className="w-4 h-4 text-[#ff5500]" />
                SESI LELANG LIVE
              </span>
              <p className="font-display text-2xl font-black text-[#ff5500]">
                {stats?.live_auctions || 0} Lot
              </p>
              <p className="text-[10px] text-[#9e9a90]">Sedang aktif di WebSocket Reverb</p>
            </div>

            <div className="p-5 bg-[#0a0c10] border border-white/10 space-y-2">
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-[#e5a93c]" />
                MENUNGGU VERIFIKASI
              </span>
              <p className="font-display text-2xl font-black text-[#e5a93c]">
                {stats?.pending_approvals || 0} Unit
              </p>
              <p className="text-[10px] text-[#9e9a90]">Perlu audit &amp; persetujuan admin</p>
            </div>

            <div className="p-5 bg-[#0a0c10] border border-white/10 space-y-2">
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9e9a90]" />
                TOTAL PENGGUNA TERDAFTAR
              </span>
              <p className="font-display text-2xl font-black text-white">
                {stats?.total_users || 0} Akun
              </p>
              <p className="text-[10px] text-[#9e9a90]">Pembeli, Dealer &amp; Operator</p>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Pending Approvals Alert */}
            <div className="p-6 bg-[#0a0c10] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#e5a93c]" />
                  Antrean Verifikasi Unit Masuk ({pendingVehicles.length})
                </span>
                <button
                  onClick={() => setCurrentTab('approvals')}
                  className="text-xs text-[#e5a93c] hover:underline uppercase"
                >
                  Kelola Semua &gt;
                </button>
              </div>

              {pendingVehicles.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5e5b54]">
                  Tidak ada unit pending. Semua mobil konsinyasi telah diverifikasi.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingVehicles.slice(0, 3).map((veh) => (
                    <div key={veh.id} className="p-3 bg-[#060709] border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white uppercase">{veh.title}</p>
                        <p className="text-[11px] text-[#9e9a90] mt-0.5">
                          {veh.seller?.name} • Plat: {veh.license_plate}
                        </p>
                      </div>
                      <button
                        onClick={() => handleApprove(veh.id)}
                        className="px-3 py-1 bg-[#d4f728] hover:bg-[#c3e622] text-black font-bold text-[10px] uppercase cursor-pointer"
                      >
                        Setujui
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Live Bidding Monitor */}
            <div className="p-6 bg-[#0a0c10] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping"></span>
                  Sesi Lelang Berjalan ({liveAuctions.length})
                </span>
                <button
                  onClick={() => setCurrentTab('auctions')}
                  className="text-xs text-[#ff5500] hover:underline uppercase"
                >
                  Buka Terminal &gt;
                </button>
              </div>

              {liveAuctions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5e5b54]">
                  Tidak ada sesi lelang yang sedang live saat ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {liveAuctions.slice(0, 3).map((auc) => (
                    <div key={auc.id} className="p-3 bg-[#060709] border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white uppercase">{auc.title}</p>
                        <p className="text-[11px] text-[#ff5500] font-bold mt-0.5">
                          {formatRupiah(auc.current_price)} ({auc.total_bids} bids)
                        </p>
                      </div>
                      <button
                        onClick={() => handleFinalize(auc.id)}
                        className="px-3 py-1 bg-white/10 hover:bg-[#ff5500] hover:text-black text-white font-bold text-[10px] uppercase cursor-pointer"
                      >
                        Finalisasi
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INPUT KENDARAAN BARU TAB */}
      {currentTab === 'create-vehicle' && (
        <div className="max-w-4xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white flex items-center gap-2">
                <Car className="w-6 h-6 text-[#d4f728]" />
                Input Unit Kendaraan Baru
              </h2>
              <p className="text-xs text-[#9e9a90] mt-1">
                Daftarkan unit konsinyasi ke database. Otomatis lolos verifikasi dan langsung siap dijadwalkan lelang.
              </p>
            </div>

            {/* Quick Presets for Instant Testing */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0c10] p-1.5 border border-white/10">
              <span className="text-[10px] text-[#d4f728] uppercase font-bold flex items-center gap-1 px-2">
                <Sparkles className="w-3 h-3" /> Preset Contoh:
              </span>
              <button
                type="button"
                onClick={() => applyPreset('civic')}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 text-[10px] text-white uppercase font-bold transition-colors cursor-pointer"
              >
                Civic Type R
              </button>
              <button
                type="button"
                onClick={() => applyPreset('fortuner')}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 text-[10px] text-white uppercase font-bold transition-colors cursor-pointer"
              >
                Fortuner GR
              </button>
              <button
                type="button"
                onClick={() => applyPreset('ioniq')}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 text-[10px] text-white uppercase font-bold transition-colors cursor-pointer"
              >
                Ioniq 5 EV
              </button>
              <button
                type="button"
                onClick={() => applyPreset('pajero')}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 text-[10px] text-white uppercase font-bold transition-colors cursor-pointer"
              >
                Pajero Dakar
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateVehicle} className="p-6 sm:p-8 bg-[#0a0c10] border border-white/10 space-y-6">
            
            {/* Bagian 1: Data Identitas Mobil */}
            <div className="space-y-4">
              <div className="text-[11px] text-[#d4f728] uppercase font-bold tracking-wider border-b border-white/10 pb-1.5">
                [ 01 // SPESIFIKASI &amp; IDENTITAS FISIK ]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Judul / Nama Lengkap Unit *</label>
                  <input
                    type="text"
                    required
                    value={vehTitle}
                    onChange={(e) => setVehTitle(e.target.value)}
                    placeholder="Contoh: Honda HR-V 1.5 SE Prestige CVT"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Pabrikan (Brand) *</label>
                  <select
                    required
                    value={vehBrand}
                    onChange={(e) => setVehBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mazda">Mazda</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Porsche">Porsche</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Model / Seri *</label>
                  <input
                    type="text"
                    required
                    value={vehModel}
                    onChange={(e) => setVehModel(e.target.value)}
                    placeholder="HR-V, Pajero, Zenix"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Tahun Produksi *</label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={vehYear}
                    onChange={(e) => setVehYear(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Transmisi *</label>
                  <select
                    value={vehTransmission}
                    onChange={(e) => setVehTransmission(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  >
                    <option value="automatic">Automatic (AT / CVT)</option>
                    <option value="manual">Manual (MT)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Bahan Bakar *</label>
                  <select
                    value={vehFuel}
                    onChange={(e) => setVehFuel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  >
                    <option value="bensin">Bensin</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="listrik">Listrik (EV)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Odometer (KM) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={vehMileage}
                    onChange={(e) => setVehMileage(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Warna Bodi *</label>
                  <input
                    type="text"
                    required
                    value={vehColor}
                    onChange={(e) => setVehColor(e.target.value)}
                    placeholder="Hitam Metalik, Putih Mutiara"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Plat Nomor Polisi *</label>
                  <input
                    type="text"
                    required
                    value={vehPlate}
                    onChange={(e) => setVehPlate(e.target.value)}
                    placeholder="B 1234 ABC"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white uppercase focus:outline-none focus:border-[#d4f728]"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Legalitas & Konsinyor */}
            <div className="space-y-4 pt-2">
              <div className="text-[11px] text-[#ff5500] uppercase font-bold tracking-wider border-b border-white/10 pb-1.5">
                [ 02 // LEGALITAS &amp; KONSINYOR / DEALER ]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Dealer Konsinyasi</label>
                  <select
                    value={vehSellerId}
                    onChange={(e) => setVehSellerId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="">-- AutoBid Pusat --</option>
                    {sellerUsers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Nomor Rangka (VIN)</label>
                  <input
                    type="text"
                    value={vehVin}
                    onChange={(e) => setVehVin(e.target.value)}
                    placeholder="MHK123456789..."
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white uppercase focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Nomor Mesin</label>
                  <input
                    type="text"
                    value={vehEngine}
                    onChange={(e) => setVehEngine(e.target.value)}
                    placeholder="ENG-998822"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white uppercase focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Nomor BPKB</label>
                  <input
                    type="text"
                    value={vehBpkb}
                    onChange={(e) => setVehBpkb(e.target.value)}
                    placeholder="L-0918273"
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white uppercase focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 3: Audit 175 Titik & Grade */}
            <div className="space-y-4 pt-2">
              <div className="text-[11px] text-[#e5a93c] uppercase font-bold tracking-wider border-b border-white/10 pb-1.5">
                [ 03 // HASIL AUDIT 175 TITIK &amp; SERTIFIKASI ]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Grade Kondisi *</label>
                  <select
                    value={vehGrade}
                    onChange={(e) => setVehGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#e5a93c]"
                  >
                    <option value="A">Grade A (Koleksi / Istimewa - Nilai 90-100)</option>
                    <option value="B">Grade B (Bagus Terawat - Nilai 80-89)</option>
                    <option value="C">Grade C (Wajar Pemakaian - Nilai 70-79)</option>
                    <option value="D">Grade D (Butuh Rekondisi - Nilai &lt; 70)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Skor Inspeksi (0 - 100) *</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={vehScore}
                    onChange={(e) => setVehScore(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#e5a93c]"
                  />
                </div>
              </div>

              {/* Foto Kendaraan (Upload Perangkat / URL) */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e9a90] flex items-center gap-1.5 font-bold">
                    <ImageIcon className="w-3.5 h-3.5 text-[#d4f728]" /> Foto Galeri Kendaraan *
                  </label>
                  
                  {/* Mode Selector Toggle */}
                  <div className="flex items-center gap-1 bg-[#060709] p-1 border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPhotoMode('upload')}
                      className={`px-2.5 py-1 uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        photoMode === 'upload'
                          ? 'bg-[#d4f728] text-black'
                          : 'text-[#9e9a90] hover:text-white'
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" />
                      Upload dari Perangkat
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoMode('url')}
                      className={`px-2.5 py-1 uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        photoMode === 'url'
                          ? 'bg-[#d4f728] text-black'
                          : 'text-[#9e9a90] hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      Input URL Gambar
                    </button>
                  </div>
                </div>

                {/* Mode A: Upload dari Perangkat (Lokal Komputer/HP) */}
                {photoMode === 'upload' && (
                  <div className="space-y-3">
                    {/* File Dropzone Box */}
                    <label className={`block border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                      isUploading 
                        ? 'border-[#d4f728] bg-[#d4f728]/5' 
                        : 'border-white/15 hover:border-[#d4f728] bg-[#060709] hover:bg-white/5'
                    }`}>
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <UploadCloud className={`w-8 h-8 mx-auto ${isUploading ? 'text-[#d4f728] animate-bounce' : 'text-[#9e9a90]'}`} />
                        <div className="text-xs text-white font-bold uppercase tracking-wider">
                          {isUploading ? 'Sedang Mengunggah Foto ke Server...' : 'Klik untuk Pilih Foto dari Perangkat Anda'}
                        </div>
                        <p className="text-[10px] text-[#5e5b54]">
                          Format didukung: JPG, PNG, WEBP (Bisa pilih beberapa foto sekaligus, Maks 10MB per foto)
                        </p>
                      </div>
                    </label>

                    {/* Uploaded Photos Preview Grid */}
                    {uploadedPhotos.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-[10px] text-[#9e9a90] flex items-center justify-between">
                          <span>TOTAL FOTO TERUNGGAH: <strong className="text-white">{uploadedPhotos.length} Foto</strong></span>
                          <span className="text-[#d4f728]">*Foto pertama otomatis menjadi foto sampul lelang</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {uploadedPhotos.map((url, idx) => (
                            <div key={idx} className="relative aspect-[4/3] bg-black border border-white/10 group overflow-hidden">
                              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                              
                              {/* Primary Badge */}
                              {idx === 0 ? (
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#d4f728] text-black font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                                  <Star className="w-2.5 h-2.5 fill-black" />
                                  SAMPUL
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryPhoto(idx)}
                                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 hover:bg-[#d4f728] hover:text-black text-[9px] text-[#9e9a90] border border-white/20 uppercase transition-colors cursor-pointer"
                                >
                                  Jadikan Sampul
                                </button>
                              )}

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                title="Hapus foto ini"
                                className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-rose-600 text-white border border-white/20 transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}

                          {/* Add More Tile */}
                          <label className="border border-dashed border-white/20 hover:border-[#d4f728] aspect-[4/3] flex flex-col items-center justify-center text-center p-2 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Plus className="w-5 h-5 text-[#9e9a90] mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase">+ Tambah Foto</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode B: Input Link URL Gambar */}
                {photoMode === 'url' && (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={vehImageUrl}
                      onChange={(e) => setVehImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... (atau gunakan tombol preset di kanan atas)"
                      className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                    />
                    {vehImageUrl && (
                      <div className="w-40 aspect-[4/3] bg-black border border-white/10 overflow-hidden relative">
                        <img src={vehImageUrl} alt="Pratinjau" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/80 text-[9px] text-[#9e9a90]">
                          Pratinjau URL
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Deskripsi &amp; Catatan Khusus Unit</label>
                <textarea
                  rows={3}
                  value={vehDesc}
                  onChange={(e) => setVehDesc(e.target.value)}
                  placeholder="Catatan servis berkala, riwayat kepemilikan tangan pertama, aksesoris tambahan..."
                  className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmittingVeh}
                className="w-full py-3.5 bg-[#d4f728] hover:bg-[#c3e622] disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,247,40,0.25)]"
              >
                <Plus className="w-4 h-4" />
                {isSubmittingVeh ? 'MENYIMPAN KE DATABASE...' : 'DAFTARKAN UNIT KE DATABASE & TERBITKAN AUDIT'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Approvals Tab */}
      {currentTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
                Verifikasi Unit Konsinyasi Masuk
              </h2>
              <p className="text-xs text-[#9e9a90] mt-1">
                Tinjau kelengkapan inspeksi 175 titik, bebas banjir, dan legalitas BPKB sebelum disetujui.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#e5a93c] text-black uppercase">
              {pendingVehicles.length} Menunggu Persetujuan
            </span>
          </div>

          {pendingVehicles.length === 0 ? (
            <div className="p-16 text-center bg-[#0a0c10] border border-dashed border-white/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#d4f728] mx-auto" />
              <p className="text-sm font-bold uppercase text-white">Semua unit telah diverifikasi</p>
              <p className="text-xs text-[#9e9a90]">Tidak ada unit konsinyasi yang menunggu persetujuan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingVehicles.map((veh) => (
                <div key={veh.id} className="p-6 bg-[#0a0c10] border border-white/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex gap-4">
                    <div className="w-24 h-20 bg-black border border-white/10 shrink-0 overflow-hidden">
                      <img
                        src={veh.primary_image?.image_url || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80'}
                        alt=""
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 bg-[#d4f728] text-black text-[9px] font-black uppercase">
                          GRADE {veh.condition_grade}
                        </span>
                        <span className="text-[10px] text-[#5e5b54]">LOT #{veh.id.toString().padStart(4, '0')}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-white uppercase">{veh.title}</h4>
                      <p className="text-xs text-[#9e9a90]">
                        Dealer: <strong className="text-white">{veh.seller?.name}</strong> • Nopol: {veh.license_plate} • Odo: {veh.mileage?.toLocaleString('id-ID')} KM
                      </p>
                      {veh.inspection && (
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-[#d4f728]">
                          <span>Skor Audit: {veh.inspection.overall_score}/100</span>
                          <span>•</span>
                          <span>Bebas Banjir: {!veh.inspection.flood_history ? 'YA' : 'TIDAK'}</span>
                          <span>•</span>
                          <span>Bebas Tabrak: {!veh.inspection.accident_history ? 'YA' : 'TIDAK'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => handleApprove(veh.id)}
                      className="px-6 py-2.5 bg-[#d4f728] hover:bg-[#c3e622] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Setujui Masuk Katalog
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auctions Management Tab */}
      {currentTab === 'auctions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
                Kontrol Sesi Lelang &amp; Intervensi
              </h2>
              <p className="text-xs text-[#9e9a90] mt-1">
                Monitor real-time tawaran masuk dan finalisasi pemenang lelang manual.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('create-auction')}
              className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              + Jadwalkan Sesi Baru
            </button>
          </div>

          <div className="bg-[#0a0c10] border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#08090b]">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping"></span>
                Daftar Sesi Lelang Aktif
              </span>
              <span className="text-[11px] text-[#9e9a90]">{liveAuctions.length} Sesi Terdeteksi</span>
            </div>

            {liveAuctions.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#5e5b54] uppercase tracking-wider">
                Saat ini tidak ada sesi lelang yang sedang live.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase bg-[#060709] text-[#5e5b54] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">ID LOT &amp; UNIT</th>
                      <th className="py-3 px-4">HARGA DASAR</th>
                      <th className="py-3 px-4">TAWARAN TERTINGGI</th>
                      <th className="py-3 px-4">TOTAL TIKET</th>
                      <th className="py-3 px-4">DEADLINE</th>
                      <th className="py-3 px-4 text-right">AKSI KONSOL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {liveAuctions.map((auc) => (
                      <tr key={auc.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-white uppercase">{auc.title}</p>
                          <p className="text-[10px] text-[#5e5b54]">LOT #{auc.id.toString().padStart(4, '0')}</p>
                        </td>
                        <td className="py-3 px-4 text-[#9e9a90]">{formatRupiah(auc.start_price)}</td>
                        <td className="py-3 px-4 text-[#ff5500] font-bold text-sm">
                          {formatRupiah(auc.current_price)}
                        </td>
                        <td className="py-3 px-4">{auc.total_bids} Bids</td>
                        <td className="py-3 px-4 text-[#e2dfd8]">
                          {new Date(auc.end_time).toLocaleTimeString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleFinalize(auc.id)}
                            className="px-3 py-1.5 bg-[#e2dfd8] hover:bg-white text-black font-bold text-[11px] uppercase cursor-pointer"
                          >
                            Finalisasi Pemenang
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Auction Form Tab */}
      {currentTab === 'create-auction' && (
        <div className="max-w-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
              Jadwalkan Sesi Lelang Baru
            </h2>
            <p className="text-xs text-[#9e9a90] mt-1">
              Pilih dari unit kendaraan yang telah disetujui (Approved) untuk dibuka ke bursa lelang.
            </p>
          </div>

          <form onSubmit={handleCreateAuction} className="p-6 bg-[#0a0c10] border border-white/10 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">
                Pilih Kendaraan (Lolos Audit)
              </label>
              <select
                required
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value)
                  const found = approvedVehicles.find((v) => v.id === Number(e.target.value))
                  if (found) {
                    setAuctionTitle(`Lelang ${found.brand} ${found.model} (${found.year})`)
                  }
                }}
                className="w-full px-3 py-2.5 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
              >
                <option value="">-- Pilih Unit Tersedia --</option>
                {approvedVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} — {v.license_plate} (Grade {v.condition_grade})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Judul Sesi Lelang</label>
              <input
                type="text"
                required
                value={auctionTitle}
                onChange={(e) => setAuctionTitle(e.target.value)}
                placeholder="Contoh: Lelang Honda HR-V E Special Edition"
                className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Harga Pembukaan (Rp)</label>
                <input
                  type="number"
                  required
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                  placeholder="200000000"
                  className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Kelipatan Penawaran (Rp)</label>
                <input
                  type="number"
                  required
                  value={bidIncrement}
                  onChange={(e) => setBidIncrement(e.target.value)}
                  placeholder="500000"
                  className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Waktu Mulai</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Waktu Selesai</label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060709] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4f728]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCreatingAuction}
                className="w-full py-3 bg-[#d4f728] hover:bg-[#c3e622] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isCreatingAuction ? 'Menjadwalkan...' : 'Publish Sesi Lelang'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users & KYC Tab */}
      {currentTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
                Direktori Pengguna &amp; Saldo Escrow
              </h2>
              <p className="text-xs text-[#9e9a90] mt-1">
                Daftar akun terdaftar, status verifikasi kepolisian (KYC), dan deposit jaminan.
              </p>
            </div>
            <span className="text-xs font-bold text-[#9e9a90] bg-[#0a0c10] border border-white/10 px-3 py-1">
              TOTAL: {usersList.length} AKUN
            </span>
          </div>

          <div className="bg-[#0a0c10] border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase bg-[#060709] text-[#5e5b54] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">UID &amp; NAMA</th>
                  <th className="py-3 px-4">EMAIL</th>
                  <th className="py-3 px-4">PERAN</th>
                  <th className="py-3 px-4">STATUS KYC</th>
                  <th className="py-3 px-4 text-right">SALDO ESCROW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-[#5e5b54]">UID #{u.id.toString().padStart(5, '0')}</p>
                    </td>
                    <td className="py-3 px-4 text-[#9e9a90]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-[#d4f728] text-black' 
                          : u.role === 'seller'
                          ? 'bg-[#e5a93c] text-black'
                          : 'bg-white/10 text-[#e2dfd8]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.kyc_verified_at ? (
                        <span className="text-[#d4f728] font-bold flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                        </span>
                      ) : (
                        <span className="text-[#9e9a90] text-[11px]">Belum Verifikasi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {formatRupiah(u.deposit_balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard
