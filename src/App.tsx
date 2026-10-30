import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { VehicleDetail } from './pages/VehicleDetail'
import { LiveRoom } from './pages/LiveRoom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { Toaster } from 'react-hot-toast'
import api from './services/api'

// Helper component to redirect to first live auction
const LiveRedirect: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const findLive = async () => {
      try {
        const res = await api.get('/auctions?status=live')
        const liveList = res.data.data
        if (liveList && liveList.length > 0) {
          navigate(`/auction/${liveList[0].id}/live`, { replace: true })
        } else {
          navigate('/catalog?status=live', { replace: true })
        }
      } catch {
        navigate('/catalog', { replace: true })
      }
    }
    findLive()
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Mencari sesi lelang live terdekat...</p>
      </div>
    </div>
  )
}

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
            }}
          />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/auction/:id/live" element={<LiveRoom />} />
              <Route path="/live" element={<LiveRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
