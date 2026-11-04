import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  BarChart3, 
  Car, 
  Gavel, 
  Users, 
  PlusCircle, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Radio
} from 'lucide-react'

interface AdminLayoutProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  pendingCount?: number
  liveCount?: number
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  pendingCount = 0,
  liveCount = 0,
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
      label: 'Ikhtisar & Telemetri',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'approvals',
      label: 'Verifikasi Unit Masuk',
      icon: Car,
      badge: pendingCount > 0 ? `${pendingCount} Menunggu` : null,
      badgeColor: 'bg-[#e5a93c] text-black',
    },
    {
      id: 'auctions',
      label: 'Kontrol Sesi Lelang',
      icon: Gavel,
      badge: liveCount > 0 ? `${liveCount} Live` : null,
      badgeColor: 'bg-[#ff5500] text-black animate-pulse',
    },
    {
      id: 'create-vehicle',
      label: '+ Input Unit Mobil Baru',
      icon: PlusCircle,
      badge: 'INPUT',
      badgeColor: 'bg-[#d4f728] text-black font-extrabold',
    },
    {
      id: 'create-auction',
      label: 'Jadwalkan Sesi Lelang',
      icon: Gavel,
      badge: null,
    },
    {
      id: 'users',
      label: 'Direktori Pengguna & KYC',
      icon: Users,
      badge: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2dfd8] flex font-mono selection:bg-[#ff5500] selection:text-black">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0a0c10] border-r border-white/10 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Admin Brand Box */}
          <div className="p-5 border-b border-white/10 bg-[#08090b]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#d4f728] text-black font-extrabold text-xs flex items-center justify-center">
                AB
              </div>
              <div>
                <span className="font-display font-black text-sm text-white uppercase tracking-tight block">
                  AUTOBID <span className="text-[#d4f728]">// OPS</span>
                </span>
                <span className="text-[9px] text-[#5e5b54] uppercase tracking-widest block -mt-0.5">
                  Admin Master Console
                </span>
              </div>
            </div>
            <div className="mt-3 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-[#9e9a90] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#d4f728]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4f728] animate-ping"></span>
                SYSTEM ACTIVE
              </span>
              <span>v2.4.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <div className="text-[10px] text-[#5e5b54] uppercase tracking-wider px-3 py-2 font-bold">
              Modul Kontrol Backoffice
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-white/10 border-l-2 border-[#d4f728] text-white font-bold'
                      : 'text-[#9e9a90] hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4f728]' : 'text-[#5e5b54]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Public Switcher */}
        <div className="p-4 border-t border-white/10 bg-[#08090b] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#e2dfd8] flex items-center justify-between transition-colors uppercase"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#ff5500]" />
              Lihat Portal Publik
            </span>
            <span className="text-[9px] text-[#5e5b54]">↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <div className="truncate pr-2">
              <p className="font-bold text-white text-[11px] truncate">{user?.name}</p>
              <p className="text-[9px] text-[#d4f728] uppercase">[ SUPER ADMIN ]</p>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Admin"
              className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-[#9e9a90] hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Backoffice Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Operational Header */}
        <header className="h-14 bg-[#0a0c10] border-b border-white/10 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#5e5b54] hidden sm:inline">CONSOLE //</span>
            <span className="text-white font-bold uppercase tracking-wider">
              {navItems.find((n) => n.id === currentTab)?.label || 'DASHBOARD'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#060709] border border-white/10 text-[#9e9a90]">
              <Radio className="w-3 h-3 text-[#d4f728] animate-pulse" />
              <span>DB: <strong className="text-white">autobid_db</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#060709] border border-white/10 text-[#9e9a90]">
              <ShieldCheck className="w-3 h-3 text-[#ff5500]" />
              <span>WS: <strong className="text-white">:8080 (Reverb)</strong></span>
            </div>
            <Link
              to="/"
              className="px-3 py-1 bg-[#d4f728] hover:bg-[#c3e622] text-black font-bold text-[11px] uppercase tracking-wider transition-colors"
            >
              Portal Pembeli ↗
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-[#08090b] border-b border-white/10 p-2 flex overflow-x-auto gap-1 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1.5 whitespace-nowrap text-[11px] font-bold uppercase ${
                currentTab === item.id ? 'bg-[#d4f728] text-black' : 'text-[#9e9a90]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Page Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
