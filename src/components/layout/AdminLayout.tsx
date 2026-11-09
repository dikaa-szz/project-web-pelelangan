import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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
  Calendar,
  CalendarPlus,
  Bell
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
      badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    },
    {
      id: 'winners',
      label: 'Data Pemenang Lelang',
      icon: Trophy,
      badge: winnersCount > 0 ? `${winnersCount} Pemenang` : null,
      badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
    },
    {
      id: 'approvals',
      label: 'Persetujuan Mobil',
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount} Menunggu` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 font-semibold',
    },
    {
      id: 'auctions',
      label: 'Sesi & Jadwal Lelang',
      icon: Gavel,
      badge: liveCount > 0 ? `${liveCount} Berjalan` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 font-semibold',
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

  // Tanggal hari ini dalam format Indonesia
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar Admin Modern & Clean */}
      <aside className="w-64 bg-[#0d1322] border-r border-slate-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800/80">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-blue-600/30">
                AB
              </div>
              <div>
                <h1 className="font-bold text-base text-white tracking-tight leading-none">
                  AutoBid Admin
                </h1>
                <p className="text-[11px] text-slate-400 mt-1">
                  Panel Pengelola Lelang
                </p>
              </div>
            </Link>
          </div>

          {/* Menu Navigasi */}
          <div className="p-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
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
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor}`}>
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
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#0a0f1b]">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              Buka Website Pembeli
            </span>
            <span className="text-[11px] text-slate-500">↗</span>
          </Link>

          {/* Info Admin Logged In */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-xs truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Administrator'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Akun"
              className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Halaman */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar Bersih & Humanis */}
        <header className="h-16 bg-[#0d1322] border-b border-slate-800/80 px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentTabObj?.label || 'Dashboard'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Sistem Siap</span>
            </div>

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
        <div className="md:hidden bg-[#0d1322] border-b border-slate-800 p-2 flex overflow-x-auto gap-1 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-medium transition-colors ${
                currentTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Isi Halaman */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
