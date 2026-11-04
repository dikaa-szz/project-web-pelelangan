import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Gavel, Award, Terminal } from 'lucide-react'

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
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] py-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Identity & Ledger Bar */}
        <div className="p-6 sm:p-8 bg-[#0f1115] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ff5500] text-black font-extrabold text-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,85,0,0.3)]">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white">
                  {user?.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 border border-white/15 text-[#ff5500] uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-[#9e9a90] mt-1">
                UID: {user?.id.toString().padStart(6, '0')} • {user?.email} • {user?.phone || 'NO TELP BELUM TERDAFTAR'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#08090b] p-4 border border-white/10">
            <div>
              <span className="text-[10px] text-[#5e5b54] uppercase tracking-wider block">Saldo Rekening Escrow Jaminan</span>
              <span className="font-display text-xl font-black text-[#d4f728]">
                {formatRupiah(user?.deposit_balance || 0)}
              </span>
            </div>
            <div className="pl-6 border-l border-white/10">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#e2dfd8]">
                <ShieldCheck className="w-4 h-4 text-[#d4f728]" />
                {user?.kyc_verified_at ? 'KYC TERVERIFIKASI' : 'KYC PENDING'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'bids'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ 01 // Penawaran Aktif ]
          </button>
          <button
            onClick={() => setActiveTab('won')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'won'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ 02 // Lot Dimenangkan ]
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#ff5500] text-[#ff5500] bg-white/5'
                : 'border-transparent text-[#9e9a90] hover:text-white'
            }`}
          >
            [ 03 // Rekening & Data Profil ]
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'bids' && (
          <div className="p-12 bg-[#0f1115] border border-white/10 text-center space-y-4">
            <Gavel className="w-10 h-10 text-[#5e5b54] mx-auto" />
            <h3 className="font-display font-bold text-base uppercase text-white">
              Tidak Ada Penawaran Tertunda
            </h3>
            <p className="text-xs text-[#9e9a90] max-w-md mx-auto font-body">
              Seluruh penawaran yang Anda ajukan dalam sesi bursa akan tercatat langsung dalam log ini secara real-time.
            </p>
            <div className="pt-2">
              <Link
                to="/catalog?status=live"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1f] text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Masuk Ruang Lelang Live &gt;
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'won' && (
          <div className="p-12 bg-[#0f1115] border border-white/10 text-center space-y-4">
            <Award className="w-10 h-10 text-[#5e5b54] mx-auto" />
            <h3 className="font-display font-bold text-base uppercase text-white">
              Belum Ada Lot yang Selesai Dimenangkan
            </h3>
            <p className="text-xs text-[#9e9a90] max-w-md mx-auto font-body">
              Setelah lelang berakhir dan Anda dinyatakan sebagai pemenang penawaran tertinggi, invoice pelunasan dan berkas serah terima unit akan diproses di tab ini.
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-8 bg-[#0f1115] border border-white/10 max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white border-b border-white/10 pb-3">
              <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
              Data Parameter Identitas Akun
            </div>
            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Nama Lengkap (KTP)</span>
                <span className="font-bold text-white">{user?.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Email Terdaftar</span>
                <span className="font-bold text-white">{user?.email}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Klasifikasi Peran</span>
                <span className="font-bold text-[#ff5500] uppercase">{user?.role}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Status Operasional</span>
                <span className="font-bold text-[#d4f728] uppercase">{user?.status}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#9e9a90]">Verifikasi Dokumen KYC</span>
                <span className="font-bold text-white">
                  {user?.kyc_verified_at ? 'VALIDASI KEPOLISIAN SELESAI' : 'MENUNGGU VERIFIKASI IDENTITAS'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
