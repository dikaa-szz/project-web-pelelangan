import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Menu, X, Shield, LayoutDashboard } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isSeller } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-[#08090b]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-none bg-[#ff5500] text-black font-mono font-black text-xs flex items-center justify-center tracking-tighter shadow-[0_0_15px_rgba(255,85,0,0.35)]">
              AB
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-[#e2dfd8] uppercase">
                Auto<span className="text-[#ff5500]">Bid</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#9e9a90] uppercase -mt-1">
                Bursa Lelang
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase">
            <Link
              to="/"
              className={`transition-colors py-1 ${
                isActive('/') ? 'text-[#ff5500] border-b border-[#ff5500]' : 'text-[#9e9a90] hover:text-[#e2dfd8]'
              }`}
            >
              [ 01 // Beranda ]
            </Link>
            <Link
              to="/catalog"
              className={`transition-colors py-1 ${
                isActive('/catalog') ? 'text-[#ff5500] border-b border-[#ff5500]' : 'text-[#9e9a90] hover:text-[#e2dfd8]'
              }`}
            >
              [ 02 // Katalog Lot ]
            </Link>
            <Link
              to="/live"
              className="flex items-center gap-2 px-3 py-1 bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] hover:bg-[#ff5500] hover:text-black transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-ping"></span>
              <span>Lelang Berjalan</span>
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-2.5 py-1 text-[11px] font-mono tracking-wider text-[#d4f728] border border-[#d4f728]/30 hover:bg-[#d4f728]/10 flex items-center gap-1.5"
                  >
                    <Shield className="w-3 h-3" />
                    [ADMIN]
                  </Link>
                )}
                {isSeller && (
                  <Link
                    to="/dashboard"
                    className="px-2.5 py-1 text-[11px] font-mono text-[#e5a93c] border border-[#e5a93c]/30 hover:bg-[#e5a93c]/10"
                  >
                    [PORTAL DEALER]
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1 text-[11px] font-mono text-[#e2dfd8] border border-white/10 hover:border-white/30 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3 h-3 text-[#9e9a90]" />
                  <span>DASHBOARD</span>
                </Link>

                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-[#e2dfd8] leading-none">{user?.name}</p>
                    <p className="text-[9px] text-[#9e9a90] uppercase mt-0.5">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar Akun"
                    className="p-1 text-[#9e9a90] hover:text-[#ff5500] transition-colors ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-[#9e9a90] hover:text-[#e2dfd8] uppercase tracking-wider"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-[#e2dfd8] hover:bg-white text-black font-bold uppercase tracking-wider transition-all"
                >
                  Registrasi
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#9e9a90] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0f1115] px-4 py-4 space-y-3 font-mono text-xs uppercase">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#9e9a90] hover:text-white"
          >
            [01 // Beranda]
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#9e9a90] hover:text-white"
          >
            [02 // Katalog Lot]
          </Link>
          <Link
            to="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#ff5500] font-bold"
          >
            ● Lelang Berjalan
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#e2dfd8]"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#d4f728]"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="block w-full text-left py-2 text-[#ff5500]"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-white/10 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center border border-white/10 text-[#e2dfd8]"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center bg-[#e2dfd8] text-black font-bold"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
export default Navbar
