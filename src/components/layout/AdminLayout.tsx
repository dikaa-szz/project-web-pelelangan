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
  Radio,
  Trophy,
  CalendarClock,
  Sparkles,
  ChevronRight
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
      label: 'Ikhtisar & Telemetri',
      icon: BarChart3,
      badge: null,
      color: 'text-indigo-400',
    },
    {
      id: 'vehicles',
      label: 'Data Mobil Lelang',
      icon: Car,
      badge: totalVehiclesCount > 0 ? `${totalVehiclesCount}` : null,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      color: 'text-emerald-400',
    },
    {
      id: 'winners',
      label: 'Data Pemenang Lelang',
      icon: Trophy,
      badge: winnersCount > 0 ? `${winnersCount}` : null,
      badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      color: 'text-amber-400',
    },
    {
      id: 'approvals',
      label: 'Verifikasi Unit Masuk',
      icon: ShieldCheck,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      badgeColor: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
      color: 'text-orange-400',
    },
    {
      id: 'auctions',
      label: 'Kontrol Sesi Lelang',
      icon: Gavel,
      badge: liveCount > 0 ? `${liveCount} LIVE` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse',
      color: 'text-rose-400',
    },
    {
      id: 'create-vehicle',
      label: 'Input Mobil Baru',
      icon: PlusCircle,
      badge: 'BARU',
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold',
      color: 'text-cyan-400',
    },
    {
      id: 'create-auction',
      label: 'Jadwalkan Sesi Lelang',
      icon: CalendarClock,
      badge: null,
      color: 'text-purple-400',
    },
    {
      id: 'users',
      label: 'Pengguna & KYC',
      icon: Users,
      badge: null,
      color: 'text-blue-400',
    },
  ]

  const currentTabObj = navItems.find((n) => n.id === currentTab)

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f3f9] flex antialiased selection:bg-[#d4f728] selection:text-black">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#0b0e17] via-[#090b12] to-[#06070a] border-r border-white/[0.07] flex flex-col justify-between shrink-0 hidden md:flex shadow-2xl relative z-20">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff5500] via-[#e5a93c] to-[#d4f728] p-[1.5px] shadow-lg shadow-[#ff5500]/20">
                  <div className="w-full h-full bg-[#090c13] rounded-[14px] flex items-center justify-center font-black text-sm tracking-tighter text-[#d4f728]">
                    AB
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0e17] animate-pulse"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">
                    AUTOBID
                  </span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#d4f728]/10 text-[#d4f728] border border-[#d4f728]/20">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block truncate">
                  Executive Admin Ops
                </span>
              </div>
            </div>

            <div className="mt-4 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                <span className="text-[11px] font-medium text-slate-300">Core Engine Online</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400">v2.5.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider px-3 py-2 font-bold flex items-center justify-between">
              <span>Navigasi Manajemen</span>
              <Sparkles className="w-3 h-3 text-[#d4f728]" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left text-xs font-medium group ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.04] text-white border border-white/10 shadow-lg shadow-black/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#d4f728]/20 text-[#d4f728]' 
                        : `${item.color} bg-white/[0.03] group-hover:bg-white/[0.08]`
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#d4f728]" />}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#06080d]/60">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center justify-between transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#ff5500] group-hover:scale-110 transition-transform" />
              Portal Publik Pembeli
            </span>
            <span className="text-[10px] text-slate-500 font-mono">↗</span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-xs truncate">{user?.name || 'Admin Master'}</p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Admin"
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Backoffice Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-[#090c13]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-300 hidden sm:flex">
              {currentTabObj?.icon ? React.createElement(currentTabObj.icon, { className: `w-4 h-4 ${currentTabObj.color}` }) : null}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">AutoBid Ops /</span>
                <span className="text-white font-bold text-sm tracking-tight">
                  {currentTabObj?.label || 'Dashboard'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden md:block">
                Sistem Pengendalian Lelang Terpusat & Terverifikasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Realtime: <strong className="text-white font-mono">:8080 Active</strong></span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4f728] to-[#c5e820] hover:brightness-105 text-black font-extrabold text-xs shadow-md shadow-[#d4f728]/15 transition-all flex items-center gap-1.5"
            >
              <span>Live Buyer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-[#0a0d16] border-b border-white/[0.08] p-2 flex overflow-x-auto gap-1.5 text-xs no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap text-xs font-semibold transition-all ${
                currentTab === item.id 
                  ? 'bg-[#d4f728] text-black shadow-md' 
                  : 'text-slate-400 bg-white/[0.03] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Page Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gradient-to-b from-transparent to-black/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
