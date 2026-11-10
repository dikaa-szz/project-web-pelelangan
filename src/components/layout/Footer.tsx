import React from 'react'
import { Link } from 'react-router-dom'
import { Gavel, ShieldCheck, Award, Phone, Mail, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identity & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  AutoBid
                </span>
                <span className="block text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Platform Lelang Otomotif Terverifikasi
                </span>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Platform lelang kendaraan terpercaya di Indonesia. Setiap unit melalui inspeksi komprehensif 175 titik, bebas banjir, bebas tabrakan parah, serta jaminan keabsahan dokumen BPKB & STNK.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>support@autobid.co.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>(021) 5088-7890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Katalog &amp; Lelang
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Semua Mobil Lelang
                </Link>
              </li>
              <li>
                <Link to="/catalog?grade=A" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Mobil Grade A (Kondisi Istimewa)
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Ruang Lelang Live
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard &amp; Riwayat Bid
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Jaminan &amp; Keamanan Transaksi
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong>Inspeksi 175 Parameter:</strong> Rangka, transmisi, mesin, dan interior diperiksa secara menyeluruh.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong>Garansi 100% Uang Kembali:</strong> Perlindungan pembeli jika dokumen kendaraan bermasalah hukum.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Gavel className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong>Penawaran Transparan:</strong> Sistem lelang terbuka dengan audit log penawaran tanpa manipulasi.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} AutoBid Indonesia. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-blue-600 cursor-pointer">Syarat &amp; Ketentuan</span>
            <span className="hover:text-blue-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-blue-600 cursor-pointer">Panduan Peserta</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
