import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Shield, Car, Gavel, DollarSign, Users } from 'lucide-react'
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
      toast.error('Gagal memuat data admin')
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleApprove = async (vehicleId: number) => {
    try {
      await api.post(`/admin/vehicles/${vehicleId}/approve`)
      toast.success('Kendaraan disetujui untuk lelang!')
      fetchAdminData()
    } catch {
      toast.error('Gagal menyetujui kendaraan')
    }
  }

  const handleFinalize = async (auctionId: number) => {
    try {
      const res = await api.post(`/admin/auctions/${auctionId}/finalize`)
      toast.success(res.data.message || 'Lelang berhasil difinalisasi!')
      fetchAdminData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal finalisasi lelang')
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Pusat Kontrol Operasional
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Admin Master Dashboard</h1>
          </div>
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Total Pengguna
            </span>
            <p className="text-2xl font-black text-white">{stats?.total_users || 0}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Car className="w-3.5 h-3.5 text-emerald-400" /> Total Unit Mobil
            </span>
            <p className="text-2xl font-black text-white">{stats?.total_vehicles || 0}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Gavel className="w-3.5 h-3.5 text-red-400" /> Lelang Sedang Live
            </span>
            <p className="text-2xl font-black text-red-400">{stats?.live_auctions || 0}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-purple-400" /> Total GMV Transaksi
            </span>
            <p className="text-2xl font-black text-purple-400">{formatRupiah(stats?.total_gmv || 0)}</p>
          </div>
        </div>

        {/* Live Auctions Control Table */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              Kontrol Lelang Live Aktif
            </h2>
            <span className="text-xs text-slate-400">{liveAuctions.length} Sesi Terdeteksi</span>
          </div>

          {liveAuctions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Tidak ada lelang yang sedang live saat ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Judul Lelang</th>
                    <th className="py-3 px-4">Harga Terkini</th>
                    <th className="py-3 px-4">Total Bid</th>
                    <th className="py-3 px-4">Sisa Waktu</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {liveAuctions.map((auc) => (
                    <tr key={auc.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-white">{auc.title}</td>
                      <td className="py-3 px-4 text-blue-400 font-bold">{formatRupiah(auc.current_price)}</td>
                      <td className="py-3 px-4">{auc.total_bids} Tawaran</td>
                      <td className="py-3 px-4 font-mono">
                        {new Date(auc.end_time).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleFinalize(auc.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm"
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Verifikasi & Approval Unit Baru</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {pendingVehicles.length} Menunggu Verifikasi
            </span>
          </div>

          {pendingVehicles.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Semua unit kendaraan telah disetujui. Tidak ada antrean baru.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {pendingVehicles.map((veh) => (
                <div key={veh.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">{veh.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Penjual: {veh.seller?.name} • Plat: {veh.license_plate} • Odo: {veh.mileage?.toLocaleString('id-ID')} km
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(veh.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Setujui Masuk Lelang
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
