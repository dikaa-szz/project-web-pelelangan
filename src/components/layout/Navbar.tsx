import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Gavel, LogOut, Menu, X, Shield, PlusCircle, LayoutDashboard } from 'lucide-react'

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
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Auto<span className="text-blue-500">Bid</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 ml-1">
                  ID
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/catalog"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/catalog') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Katalog Mobil
            </Link>
            <Link
              to="/live"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/live') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-red-400 font-semibold">Lelang Live</span>
            </Link>
          </nav>

          {/* User Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                {isSeller && (
                  <Link
                    to="/seller/add-vehicle"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Jual Mobil
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 border border-slate-700"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  Daftar Lelang
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Beranda
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Katalog Mobil
          </Link>
          <Link
            to="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-slate-800"
          >
            🔴 Lelang Live Sekarang
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="px-3 py-2 text-sm text-slate-400">
                Login sebagai: <span className="font-semibold text-white">{user?.name}</span> ({user?.role})
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-slate-800"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 font-medium"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30"
              >
                Daftar Akun
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
export default Navbar
