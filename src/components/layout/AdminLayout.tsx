import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { 
  LayoutDashboard, 
  Car, 
  Gavel, 
  Users, 
  PlusCircle, 
  LogOut, 
  ExternalLink, 
  CheckSquare, 
  Trophy,
  CalendarPlus,
  Sun,
  Moon
} from 'lucide-react'

interface AdminLayoutProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  pendingCount?: number
  liveCount?: number
  totalVehiclesCount?: number
  winnersCount?: number
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  pendingCount = 0,
  liveCount = 0,
  totalVehiclesCount = 0,
  winnersCount = 0,
  children,
}) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    {
      id: 'overview',
      label: 'Ringkasan Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'vehicles',
      label: 'Data Mobil Lelang',
      icon: Car,
      badge: totalVehiclesCount > 0 ? `${totalVehiclesCount} Mobil` : null,
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    },
    {
      id: 'winners',
      label: 'Data Pemenang Lelang',
      icon: Trophy,
      badge: winnersCount > 0 ? `${winnersCount} Pemenang` : null,
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/20',
    },
    {
      id: 'approvals',
      label: 'Persetujuan Mobil',
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount} Menunggu` : null,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold',
    },
    {
      id: 'auctions',
      label: 'Sesi & Jadwal Lelang',
      icon: Gavel,
      badge: liveCount > 0 ? `${liveCount} Berjalan` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold',
    },
    {
      id: 'create-vehicle',
      label: 'Tambah Mobil Baru',
      icon: PlusCircle,
      badge: null,
    },
    {
      id: 'create-auction',
      label: 'Buat Jadwal Lelang',
      icon: CalendarPlus,
      badge: null,
    },
    {
      id: 'users',
      label: 'Daftar Pengguna',
      icon: Users,
      badge: null,
    },
  ]

  const currentTabObj = navItems.find((n) => n.id === currentTab)

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen flex antialiased transition-colors duration-200 ${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar Admin Modern */}
      <aside className={`w-64 flex flex-col justify-between shrink-0 hidden md:flex border-r transition-colors duration-200 ${
        isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          {/* Logo Header */}
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-blue-600/30">
                AB
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight leading-none">
                  AutoBid Admin
                </h1>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Panel Pengelola Lelang
                </p>
              </div>
            </Link>
          </div>

          {/* Menu Navigasi */}
          <div className="p-3">
            <p className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600 font-bold'
            }`}>
              Menu Utama
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className={`p-4 border-t space-y-3 ${
          isDark ? 'border-slate-800 bg-[#0a0f1b]' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <Link
            to="/"
            target="_blank"
            className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
              isDark ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              Buka Website Pembeli
            </span>
            <span className="text-[11px] text-slate-400">↗</span>
          </Link>

          {/* Info Admin Logged In */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs truncate">{user?.name || 'Admin'}</p>
                <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {user?.email || 'Administrator'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Akun"
              className="p-1.5 rounded-lg hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Halaman */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar Bersih */}
        <header className={`h-16 border-b px-6 lg:px-8 flex items-center justify-between shrink-0 transition-colors duration-200 ${
          isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span>{currentTabObj?.label || 'Dashboard'}</span>
            </h2>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Theme Toggle Button (Light/Dark Switcher) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Ganti ke Tema Putih / Terang' : 'Ganti ke Tema Gelap'}
              className={`p-2 rounded-lg border flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] hidden sm:inline">Tema Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] hidden sm:inline">Tema Gelap</span>
                </>
              )}
            </button>

            <Link
              to="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Website Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className={`md:hidden border-b p-2 flex overflow-x-auto gap-1 text-xs ${
          isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-medium transition-colors ${
                currentTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Isi Halaman */}
        <main className={`flex-1 p-6 lg:p-8 overflow-y-auto transition-colors duration-200 ${
          isDark ? 'bg-[#0b0f19]' : 'bg-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
