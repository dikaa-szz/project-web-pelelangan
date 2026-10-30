import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Gavel, Award } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'bids' | 'won' | 'profile'>('bids')

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
        {/* User Greeting & Stats Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.email} • {user?.phone || 'No telp belum diisi'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Saldo Deposit Jaminan</p>
              <p className="text-lg font-black text-emerald-400">
                {formatRupiah(user?.deposit_balance || 0)}
              </p>
            </div>
            <div className="pl-4 border-l border-slate-800">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {user?.kyc_verified_at ? 'KYC Terverifikasi' : 'KYC Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('bids')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'bids'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Aktivitas Penawaran Saya
          </button>
          <button
            onClick={() => setActiveTab('won')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'won'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Lelang yang Dimenangkan
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Data Akun & Rekening
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center py-12 space-y-3">
              <Gavel className="w-12 h-12 text-blue-500/50 mx-auto" />
              <h3 className="font-bold text-white text-base">Ikuti Sesi Lelang Aktif</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Masuk ke ruang lelang live untuk mengajukan penawaran waktu-nyata dan melihat status Anda di papan penawar tertinggi.
              </p>
              <Link
                to="/catalog?status=live"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 mt-2"
              >
                Cari Lelang Live
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'won' && (
          <div className="space-y-4">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center py-12 space-y-2">
              <Award className="w-12 h-12 text-amber-500/50 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">Belum ada lelang yang dimenangkan.</p>
              <p className="text-xs text-slate-500">Unit lelang yang berhasil Anda menangkan akan muncul di tab ini untuk proses pelunasan dan serah terima.</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Informasi Profil Akun</h3>
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">Nama Lengkap</span>
                <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">Peran Akun</span>
                <span className="font-semibold text-white capitalize">{user?.role}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-400">Status Akun</span>
                <span className="font-semibold text-emerald-400 capitalize">{user?.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Dashboard
