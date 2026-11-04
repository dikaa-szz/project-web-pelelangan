import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Phone, Building, ArrowRight } from 'lucide-react'

export const Register: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await register({
      name,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
      role,
      company_name: role === 'seller' ? companyName : undefined,
    })
    setSubmitting(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] flex items-center justify-center p-4 py-16 font-mono">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#ff5500] text-black font-extrabold text-sm flex items-center justify-center tracking-tighter shadow-[0_0_20px_rgba(255,85,0,0.35)]">
              AB
            </div>
          </Link>
          <div className="text-[10px] text-[#ff5500] uppercase tracking-widest">[ REGISTRASI IDENTITAS // AUTOBID ]</div>
          <h1 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
            Pendaftaran Akun Baru
          </h1>
          <p className="text-xs text-[#9e9a90] font-body">
            Pilih klasifikasi peran akun Anda dalam sistem kliring lelang terbuka.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0f1115] border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
              role === 'buyer'
                ? 'bg-[#ff5500] text-black shadow-md'
                : 'text-[#9e9a90] hover:text-white'
            }`}
          >
            [ Pembeli / Peserta ]
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
              role === 'seller'
                ? 'bg-[#ff5500] text-black shadow-md'
                : 'text-[#9e9a90] hover:text-white'
            }`}
          >
            [ Konsinyor / Dealer ]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-[#0f1115] border border-white/10 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">
              {role === 'seller' ? 'Nama Penanggung Jawab Resmi' : 'Nama Lengkap (Sesuai KTP)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
          </div>

          {role === 'seller' && (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Nama Dealer / Entitas Usaha</label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="PT Auto Maju Berkembang"
                  className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Nomor Telepon / WhatsApp</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9a90]">Konfirmasi Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5e5b54] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi sandi"
                  className="w-full pl-10 pr-4 py-2 bg-[#08090b] border border-white/10 text-xs text-white placeholder-[#5e5b54] focus:outline-none focus:border-[#ff5500] transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#ff5500] hover:bg-[#ff6a1f] disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.25)]"
          >
            {submitting ? 'MEMPROSES PENDAFTARAN...' : 'SELESAIKAN PENDAFTARAN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#9e9a90]">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-[#ff5500] hover:underline font-bold uppercase tracking-wider">
            [ Masuk ke Akun ]
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
