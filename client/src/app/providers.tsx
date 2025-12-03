'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, User } from '@/types/auth'
import { NotificationProvider } from '@/contexts/NotificationContext'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { authAPI } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Logout function - defined early to avoid circular dependency
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Validate token with server
  const validateToken = async (authToken: string) => {
    try {
      const response = await authAPI.getCurrentUser()
      if (response.data.success && response.data.data) {
        const userData = response.data.data
        const userObj: User = {
          id: userData.id || userData._id,
          name: userData.name,
          email: userData.email,
          mobile: userData.phone || userData.mobile || '',
          role: userData.role
        }
        setUser(userObj)
        setToken(authToken)
        localStorage.setItem('user', JSON.stringify(userObj))
        return true
      }
      return false
    } catch (error) {
      // Token is invalid or expired - clear auth state
      logout()
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      return false
    }
  }

  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return
    
    const initializeAuth = async () => {
      // Check for stored token on mount
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          // Validate token with server on refresh
          const isValid = await validateToken(storedToken)
          if (!isValid) {
            // Token is invalid, clear everything
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
            setToken(null)
          }
        } catch (error) {
          // Error validating token, clear everything
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          setToken(null)
        }
      } else {
        // No token found, ensure clean state
        setUser(null)
        setToken(null)
      }
      
      setLoading(false)
      setIsInitialized(true)
    }

    initializeAuth()
  }, [isInitialized])

  // Handle page refresh - validate token when page becomes visible
  useEffect(() => {
    if (!isInitialized) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Page became visible after refresh, verify token is still valid
        const storedToken = localStorage.getItem('token')
        if (storedToken && user) {
          // Validate token with server
          await validateToken(storedToken)
        } else if (!storedToken && user) {
          // Token was cleared, logout
          logout()
        }
      }
    }

    // Also check on focus (when user switches back to tab)
    const handleFocus = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken && user) {
        await validateToken(storedToken)
      } else if (!storedToken && user) {
        logout()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isInitialized, user])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <NotificationContainer />
      </NotificationProvider>
    </AuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


