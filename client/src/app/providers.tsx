'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
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
    // Clear state first
    setUser(null)
    setToken(null)
    // Clear localStorage (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    // Reset initialization state
    setIsInitialized(false)
    setLoading(true)
  }

  // Validate token with server
  const validateToken = async (authToken: string) => {
    try {
      const response = await authAPI.getCurrentUser()
      if (response.data.success && response.data.data) {
        const userData = response.data.data
        const userObj: User = {
          id: userData.id || userData._id,
          name: userData.name || userData.full_name,
          email: userData.email,
          mobile: userData.phone || userData.mobile || '',
          role: userData.role // Role comes from backend response
        }
        setUser(userObj)
        setToken(authToken)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userObj))
          localStorage.setItem('token', authToken) // Ensure token is stored
        }
        return true
      }
      // Invalid response, clear auth state
      logout()
      return false
    } catch (error: any) {
      // Only logout on 401 (unauthorized) or 403 (forbidden) errors
      // Network errors or 500 errors should not cause logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Token validation failed - unauthorized:', error)
        logout()
        return false
      }
      // For other errors (network, 500, etc.), don't logout - just return false
      console.warn('Token validation error (non-critical):', error)
      return false
    }
  }

  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return
    
    const initializeAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false)
        setIsInitialized(true)
        return
      }
      
      // Check for stored token on mount
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          // Parse user from localStorage first to set state immediately
          try {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser && parsedUser.role) {
              // Set user state immediately from localStorage (optimistic update)
              setUser(parsedUser)
              setToken(storedToken)
            }
          } catch (e) {
            // Invalid user data, will be cleared below
          }
          
          // Validate token with server
          const isValid = await validateToken(storedToken)
          
          if (isValid) {
            // Token is valid, user state is already set by validateToken
            setLoading(false)
            setIsInitialized(true)
          } else {
            // Token is invalid, clear everything
            logout()
            setLoading(false)
            setIsInitialized(true)
          }
        } catch (error) {
          // Error validating token, clear everything
          console.error('Token validation error:', error)
          logout()
          setLoading(false)
          setIsInitialized(true)
        }
      } else {
        // No token found, ensure clean state
        setUser(null)
        setToken(null)
        setLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [isInitialized])

  // Removed aggressive token validation on visibility/focus changes
  // This was causing users to be logged out automatically
  // Token validation only happens on initial load now

  const login = (userData: User, authToken: string) => {
    // Store in localStorage first (synchronous) - this happens immediately (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
    }
    // Update state synchronously to avoid delays
    setUser(userData)
    setToken(authToken)
    // Mark as initialized to prevent re-initialization
    setIsInitialized(true)
    setLoading(false)
    // Return a promise that resolves after state is set
    return Promise.resolve()
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
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


