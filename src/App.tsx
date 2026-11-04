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
    <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#ff5500] border-t-transparent animate-spin mx-auto"></div>
        <p className="uppercase tracking-widest">[ MENCARI SESI LELANG LIVE AKTIF... ]</p>
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
      <div className="min-h-screen bg-[#08090b] flex items-center justify-center text-[#9e9a90] font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#ff5500] border-t-transparent animate-spin mx-auto"></div>
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

// Public Layout Wrapper (with Public Navbar & Public Footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2dfd8] flex flex-col font-body selection:bg-[#ff5500] selection:text-black">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f1115',
              color: '#e2dfd8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            },
          }}
        />
        <Routes>
          {/* Admin Backoffice Portal Route - Completely Separate Layout (No Public Navbar/Footer) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public & Customer Routes - Uses Public Layout */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/catalog"
            element={
              <PublicLayout>
                <Catalog />
              </PublicLayout>
            }
          />
          <Route
            path="/vehicle/:id"
            element={
              <PublicLayout>
                <VehicleDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/auction/:id/live"
            element={
              <PublicLayout>
                <LiveRoom />
              </PublicLayout>
            }
          />
          <Route
            path="/live"
            element={
              <PublicLayout>
                <LiveRedirect />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PublicLayout>
                  <Dashboard />
                </PublicLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
