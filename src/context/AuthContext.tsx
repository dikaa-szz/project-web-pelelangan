import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { User } from '../types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isSeller: boolean
  isBuyer: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('autobid_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('autobid_token')
  })
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await api.get('/user')
      setUser(res.data.user)
      localStorage.setItem('autobid_user', JSON.stringify(res.data.user))
    } catch {
      setUser(null)
      setToken(null)
      localStorage.removeItem('autobid_user')
      localStorage.removeItem('autobid_token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [token])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/login', { email, password })
      const { user: loggedInUser, token: authToken, message } = res.data

      setUser(loggedInUser)
      setToken(authToken)
      localStorage.setItem('autobid_token', authToken)
      localStorage.setItem('autobid_user', JSON.stringify(loggedInUser))

      toast.success(message || 'Login berhasil!')
      return true
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login gagal, periksa email dan password.'
      toast.error(errMsg)
      return false
    }
  }

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await api.post('/register', data)
      const { user: registeredUser, token: authToken, message } = res.data

      setUser(registeredUser)
      setToken(authToken)
      localStorage.setItem('autobid_token', authToken)
      localStorage.setItem('autobid_user', JSON.stringify(registeredUser))

      toast.success(message || 'Registrasi berhasil!')
      return true
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registrasi gagal, periksa data Anda.'
      toast.error(errMsg)
      return false
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout')
      }
    } catch {
      // ignore
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('autobid_user')
      localStorage.removeItem('autobid_token')
      toast.success('Berhasil logout')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller',
        isBuyer: user?.role === 'buyer',
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
