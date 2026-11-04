import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Terminal } from 'lucide-react'

export const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await login(email, password)
    setSubmitting(false)
    if (success) {
      navigate('/')
    }
  }

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#ff5500] text-black font-extrabold text-sm flex items-center justify-center tracking-tighter shadow-[0_0_20px_rgba(255,85,0,0.35)]">
              AB
            </div>
          </Link>
          <div className="text-[10px] text-[#ff5500] uppercase tracking-widest">[ AUTENTIKASI AKSES // AUTOBID ]</div>
          <h1 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
            Masuk Terminal Bursa
          </h1>
          <p className="text-xs text-[#9e9a90] font-body">
            Gunakan kredensial terdaftar untuk berpartisipasi dalam sesi lelang langsung.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="p-4 bg-[#0f1115] border border-white/10 text-xs space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-[#d4f728] font-bold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            Preset Akun Pengujian (Klik untuk Isi):
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@autobid.id')}
              className="px-2 py-1.5 bg-black border border-white/15 hover:border-[#d4f728] text-left hover:text-[#d4f728] transition-colors cursor-pointer"
            >
              <span className="text-[9px] text-[#5e5b54] block">PERAN</span>
              <span className="font-bold">ADMIN</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('buyer1@gmail.com')}
              className="px-2 py-1.5 bg-black border border-white/15 hover:border-[#ff5500] text-left hover:text-[#ff5500] transition-colors cursor-pointer"
            >
              <span className="text-[9px] text-[#5e5b54] block">PERAN</span>
              <span className="font-bold">PEMBELI</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('seller1@dealer.com')}
              className="px-2 py-1.5 bg-black border border-white/15 hover:border-[#e5a93c] text-left hover:text-[#e5a93c] transition-colors cursor-pointer"
            >
              <span className="text-[9px] text-[#5e5b54] block">PERAN</span>
              <span className="font-bold">DEALER</span>
            </button>
          </div>
          <p className="text-[10px] text-[#5e5b54] pt-1">
            *Kata sandi otomatis diisi: <code className="text-[#9e9a90]">password123</code>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-[#0f1115] border border-white/10 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#ff5500] hover:bg-[#ff6a1f] disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.25)]"
          >
            {submitting ? 'MEMVERIFIKASI KREDENSIAL...' : 'MASUK KE BURSA'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#9e9a90]">
          Belum terdaftar?{' '}
          <Link to="/register" className="text-[#ff5500] hover:underline font-bold uppercase tracking-wider">
            [ Buat Akun Baru ]
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
