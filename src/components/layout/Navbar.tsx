import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { LogOut, Menu, X, Shield, LayoutDashboard, Radio, Sun, Moon } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isSeller } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path
  const isDark = theme === 'dark'

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0b0f19]/90 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base text-white shadow-md shadow-blue-600/30">
              AB
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none flex items-center gap-2">
                AutoBid
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  Lelang Mobil
                </span>
              </span>
              <span className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Bursa Lelang Otomotif Terpercaya
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/catalog"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                isActive('/catalog') 
                  ? 'bg-blue-600 text-white' 
                  : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Katalog Mobil
            </Link>
            <Link
              to="/live"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold ml-2 transition-colors ${
                isDark 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25' 
                  : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Lelang Langsung</span>
            </Link>
          </nav>

          {/* Action & Theme Switcher */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {/* Tombol Tema Terang / Gelap */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Ganti ke Tema Putih / Terang' : 'Ganti ke Tema Gelap'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                
                {isSeller && (
                  <Link
                    to="/dashboard"
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20"
                  >
                    Portal Dealer
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <div className={`flex items-center gap-2.5 pl-3 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold leading-none">{user?.name}</p>
                    <p className={`text-[10px] capitalize mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    className="p-1.5 rounded-lg hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-3.5 py-2 rounded-lg font-semibold text-xs transition-colors ${
                    isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Switcher */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t p-4 space-y-2 ${
          isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium"
          >
            Beranda
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium"
          >
            Katalog Mobil
          </Link>
          <Link
            to="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-rose-500 bg-rose-500/10"
          >
            Lelang Langsung
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800/20 space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-500"
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-500"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800/20 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-sm font-medium border"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white"
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
