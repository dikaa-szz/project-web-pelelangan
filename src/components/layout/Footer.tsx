import React from 'react'
import { Link } from 'react-router-dom'
import { Gavel, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Gavel className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                Auto<span className="text-blue-500">Bid</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform pelelangan mobil bekas live real-time pertama di Indonesia dengan transparansi 100%, sertifikasi inspeksi 175 titik, dan integrasi penawaran aman.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Transaksi Aman
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Real-Time Bidding
              </span>
            </div>
          </div>

          {/* Navigasi lelang */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigasi Lelang</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-blue-400 transition-colors">
                  Katalog Mobil Lengkap
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-blue-400 transition-colors">
                  Jadwal Lelang Live
                </Link>
              </li>
              <li>
                <Link to="/catalog?grade=A" className="hover:text-blue-400 transition-colors">
                  Mobil Grade A (Istimewa)
                </Link>
              </li>
              <li>
                <Link to="/catalog?transmission=automatic" className="hover:text-blue-400 transition-colors">
                  Mobil Transmisi Otomatis
                </Link>
              </li>
            </ul>
          </div>

          {/* Aturan & Panduan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Bantuan & Aturan</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>Standar Inspeksi 175 Titik</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Mekanisme Anti-Sniping (+2 Menit)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Garansi Uang Kembali Jika Manipulasi</span>
              </li>
              <li>
                <span>Tata Cara Pembayaran & Serah Terima</span>
              </li>
            </ul>
          </div>

          {/* Kontak & Alamat */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pusat Layanan</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Gedung Bursa Otomotif Lt. 5, Jl. Panjang Raya, Kebon Jeruk, Jakarta Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+62 21 555-8899 (Hunting)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@autobid.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AutoBid Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6">
            <span>Syarat & Ketentuan Bidding</span>
            <span>Kebijakan Privasi</span>
            <span>Ketentuan Anti-Pencucian Uang (AML)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
