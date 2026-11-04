import React from 'react'
import { Link } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-white/10 text-[#9e9a90] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ff5500]"></span>
              <span className="font-display font-extrabold text-base text-[#e2dfd8] uppercase tracking-tight">
                AUTOBID // BURSA LELANG KONSINYASI
              </span>
            </div>
            <p className="text-xs text-[#9e9a90] leading-relaxed max-w-sm">
              Sistem pelelangan kendaraan bermotor berbasis penawaran terbuka real-time. Setiap transaksi diawasi verifikasi fisik 175 titik independen dan validasi legalitas dokumen BPKB/STNK.
            </p>
            <div className="pt-2 text-[11px] text-[#5e5b54]">
              LATENSI KONSENSUS: &lt; 85MS // SERVER: JAKARTA-01
            </div>
          </div>

          {/* Directory */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-[#e2dfd8] uppercase tracking-wider text-[11px]">Indeks Lot</p>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="hover:text-[#ff5500] transition-colors">
                  &gt; Semua Lot Tersedia
                </Link>
              </li>
              <li>
                <Link to="/catalog?grade=A" className="hover:text-[#ff5500] transition-colors">
                  &gt; Sertifikasi Grade A (Koleksi)
                </Link>
              </li>
              <li>
                <Link to="/catalog?status=live" className="hover:text-[#ff5500] transition-colors">
                  &gt; Ruang Lelang Sedang Berjalan
                </Link>
              </li>
            </ul>
          </div>

          {/* Protokol & Legal */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-bold text-[#e2dfd8] uppercase tracking-wider text-[11px]">Protokol Penawaran</p>
            <div className="space-y-1.5 text-[11px] text-[#9e9a90]">
              <p>• Ketentuan Anti-Sniping (+120 detik per penawaran kritis)</p>
              <p>• Jaminan Pembeli: Pengembalian dana penuh bila ada cacat rangka/banjir tersembunyi</p>
              <p>• Rekening Penampung: Virtual Account Resmi AutoBid Indonesia</p>
            </div>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#5e5b54]">
          <p>© {new Date().getFullYear()} AUTOBID INDONESIA. SELURUH HAK CIPTA DILINDUNGI.</p>
          <div className="flex gap-4 uppercase tracking-widest">
            <span>KEBIJAKAN RISIKO</span>
            <span>SYARAT PESERTA</span>
            <span>VERIFIKASI FISIK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
