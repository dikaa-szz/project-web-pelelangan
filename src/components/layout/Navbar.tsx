import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Menu, X, Shield, LayoutDashboard, Radio, ChevronRight } from 'lucide-react'

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
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Modern Luxury Brand Mark */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
                <div className="w-full h-full bg-[#070a10] rounded-[14px] flex items-center justify-center font-black text-sm tracking-tighter text-emerald-400">
                  AB
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070a10] animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                AUTOBID <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PREMIUM</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium -mt-0.5 tracking-wide">
                Bursa Lelang Otomotif Eksklusif
              </span>
            </div>
          </Link>

          {/* Modern Clean Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/') 
                  ? 'bg-white/[0.08] text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/catalog"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/catalog') 
                  ? 'bg-white/[0.08] text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Katalog Mobil
            </Link>
            <Link
              to="/live"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500/15 to-orange-500/15 border border-rose-500/30 text-rose-300 hover:text-white hover:border-rose-500/60 transition-all font-bold ml-2 shadow-sm"
            >
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Lelang Sedang Berlangsung</span>
            </Link>
          </nav>

          {/* Modern Auth Actions */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                
                {isSeller && (
                  <Link
                    to="/dashboard"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                  >
                    Portal Dealer
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dashboard Saya</span>
                </Link>

                <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                      <p className="text-[10px] text-emerald-400 capitalize font-medium mt-0.5">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Masuk Akun
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                >
                  <span>Daftar Peserta</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#070a10]/95 backdrop-blur-2xl p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/[0.05]"
          >
            Beranda
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/[0.05]"
          >
            Katalog Mobil
          </Link>
          <Link
            to="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20"
          >
            Lelang Sedang Berlangsung
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10"
                >
                  Panel Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.05]"
              >
                Dashboard Akun
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10"
              >
                Keluar Akun
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.05]"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl text-sm font-bold bg-emerald-400 text-slate-950"
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
