import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Shield, Car, Gavel, DollarSign, Users, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [pendingVehicles, setPendingVehicles] = useState<any[]>([])
  const [liveAuctions, setLiveAuctions] = useState<any[]>([])

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes, auctionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/vehicles/pending'),
        api.get('/auctions?status=live'),
      ])
      setStats(statsRes.data)
      setPendingVehicles(pendingRes.data || [])
      setLiveAuctions(auctionsRes.data.data || [])
    } catch (err) {
      console.error('Failed to fetch admin data', err)
      toast.error('Gagal mengambil data telemetri admin.')
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleApprove = async (vehicleId: number) => {
    try {
      await api.post(`/admin/vehicles/${vehicleId}/approve`)
      toast.success('Unit telah disetujui untuk registrasi jadwal lelang!')
      fetchAdminData()
    } catch {
      toast.error('Gagal memverifikasi unit.')
    }
  }

  const handleFinalize = async (auctionId: number) => {
    try {
      const res = await api.post(`/admin/auctions/${auctionId}/finalize`)
      toast.success(res.data.message || 'Sesi lelang berhasil difinalisasi!')
      fetchAdminData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memfinalisasi lelang.')
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

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Ops Command Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-[#d4f728] text-[11px] uppercase tracking-widest mb-1">
              <Shield className="w-3.5 h-3.5" />
              [ KONSOL PUSAT KONTROL &amp; ARBITRASE LELANG ]
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
              Admin Ops Center
            </h1>
          </div>
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-[#e2dfd8] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ff5500]" />
            Sinkronkan Data
          </button>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0f1115] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#5e5b54] uppercase flex items-center gap-1.5 tracking-wider">
              <Users className="w-3.5 h-3.5 text-[#9e9a90]" /> TOTAL PENGGUNA
            </span>
            <p className="font-display text-2xl font-black text-white">{stats?.total_users || 0}</p>
          </div>

          <div className="p-5 bg-[#0f1115] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#5e5b54] uppercase flex items-center gap-1.5 tracking-wider">
              <Car className="w-3.5 h-3.5 text-[#9e9a90]" /> ARMADA LOT
            </span>
            <p className="font-display text-2xl font-black text-white">{stats?.total_vehicles || 0}</p>
          </div>

          <div className="p-5 bg-[#0f1115] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#ff5500] uppercase flex items-center gap-1.5 tracking-wider">
              <Gavel className="w-3.5 h-3.5 text-[#ff5500]" /> SESI LIVE AKTIF
            </span>
            <p className="font-display text-2xl font-black text-[#ff5500]">{stats?.live_auctions || 0}</p>
          </div>

          <div className="p-5 bg-[#0f1115] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#d4f728] uppercase flex items-center gap-1.5 tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-[#d4f728]" /> TOTAL GMV TRANSAKSI
            </span>
            <p className="font-display text-xl font-black text-[#d4f728]">{formatRupiah(stats?.total_gmv || 0)}</p>
          </div>
        </div>

        {/* Live Auctions Table */}
        <div className="bg-[#0f1115] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-display font-bold text-base text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff5500] animate-ping"></span>
              Kontrol Intervensi Sesi Lelang Berjalan
            </h2>
            <span className="text-xs text-[#9e9a90]">{liveAuctions.length} Sesi Terdeteksi</span>
          </div>

          {liveAuctions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5e5b54] uppercase tracking-wider">
              Tidak ada sesi lelang yang memerlukan intervensi langsung.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase bg-[#08090b] text-[#5e5b54] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">LOT &amp; JUDUL</th>
                    <th className="py-3 px-4">TAWARAN TERTINGGI</th>
                    <th className="py-3 px-4">TOTAL BID</th>
                    <th className="py-3 px-4">DEADLINE</th>
                    <th className="py-3 px-4 text-right">AKSI KONTROL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {liveAuctions.map((auc) => (
                    <tr key={auc.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white uppercase">{auc.title}</td>
                      <td className="py-3 px-4 text-[#ff5500] font-black">{formatRupiah(auc.current_price)}</td>
                      <td className="py-3 px-4 text-[#9e9a90]">{auc.total_bids} Tawaran</td>
                      <td className="py-3 px-4 text-[#e2dfd8]">
                        {new Date(auc.end_time).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleFinalize(auc.id)}
                          className="px-3 py-1.5 bg-[#e2dfd8] hover:bg-white text-black font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Finalisasi Manual
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Vehicles Approval */}
        <div className="bg-[#0f1115] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-display font-bold text-base text-white uppercase">
              Antrean Verifikasi Konsinyasi Unit
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#e5a93c]/10 text-[#e5a93c] border border-[#e5a93c]/20 uppercase">
              {pendingVehicles.length} Menunggu Approval
            </span>
          </div>

          {pendingVehicles.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5e5b54] uppercase tracking-wider">
              Semua unit konsinyasi telah lolos audit dan diverifikasi.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pendingVehicles.map((veh) => (
                <div key={veh.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase">{veh.title}</h4>
                    <p className="text-xs text-[#9e9a90] mt-0.5">
                      Konsinyor: {veh.seller?.name} • Nopol: {veh.license_plate} • Odo: {veh.mileage?.toLocaleString('id-ID')} KM
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(veh.id)}
                      className="px-4 py-2 bg-[#d4f728] hover:bg-[#c2e420] text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Setujui Masuk Katalog
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
