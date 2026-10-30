import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Gavel, Mail, Lock, ArrowRight } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Gavel className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Masuk ke AutoBid</h1>
          <p className="text-xs text-slate-400">Masuk untuk mengikuti lelang live dan memantau penawaran Anda.</p>
        </div>

        {/* Quick Demo Credentials Help */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">Akun Uji Coba Cepat (Password: password123):</p>
          <p>• Admin: <span className="text-blue-400 font-mono">admin@autobid.id</span></p>
          <p>• Pembeli: <span className="text-blue-400 font-mono">buyer1@gmail.com</span></p>
          <p>• Penjual Dealer: <span className="text-blue-400 font-mono">seller1@dealer.com</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Memproses...' : 'Masuk Akun'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
export default Login
