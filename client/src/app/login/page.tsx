'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/app/providers'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, loading } = useAuth()
  const [loginType, setLoginType] = useState<'patient' | 'doctor'>('patient')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in - prevent direct access to login page
  // Only check on initial load, not during login process
  useEffect(() => {
    // Don't redirect if we're currently processing a login
    if (isLoading) return
    
    // Only check after auth context has finished loading
    if (loading) return
    
    // Check if user is already logged in (only on mount, not during login)
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    // Only redirect if we have both token and user data, AND user state is set
    // This prevents redirecting during the login process
    if (storedToken && storedUser && user && user.role) {
      // User is logged in and on login page - redirect to correct dashboard
      const dashboardPath = user.role === 'patient' 
        ? '/patient/dashboard' 
        : user.role === 'doctor' 
        ? '/doctor/dashboard' 
        : '/admin/dashboard'
      // Use window.location.replace to ensure clean redirect
      window.location.replace(dashboardPath)
    } else if (storedToken && storedUser && !user) {
      // We have localStorage data but user state not ready yet
      // Try to parse from localStorage as fallback
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.role) {
          const dashboardPath = parsedUser.role === 'patient' 
            ? '/patient/dashboard' 
            : parsedUser.role === 'doctor' 
            ? '/doctor/dashboard' 
            : '/admin/dashboard'
          window.location.replace(dashboardPath)
        }
      } catch (e) {
        // Invalid user data, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [user, loading, isLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.email?.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address')
      return
    }
    if (!formData.password) {
      setError('Please enter your password')
      return
    }
    setIsLoading(true)

    try {
      const response = await authAPI.patientLogin(formData.email, formData.password)
      if (response.data.success) {
        const patientData = response.data.data.patient
        const userData = {
          id: patientData.id || patientData._id,
          name: patientData.name || patientData.full_name,
          mobile: patientData.phone || patientData.mobile || '',
          email: patientData.email,
          role: 'patient' as const
        }
        login(userData, response.data.data.token)
        const redirect = searchParams.get('redirect')
        const go = (redirect && redirect.startsWith('/patient')) ? redirect : '/patient/dashboard'
        window.location.replace(go)
        return
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message
      setError(msg || 'Invalid email or password')
      if (!err.response) setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setError('')
    if (!formData.email?.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address')
      return
    }
    if (!formData.password) {
      setError('Please enter your password')
      return
    }
    setIsLoading(true)

    try {
      const response = await authAPI.doctorLogin(formData.email, formData.password)
      if (response.data.success) {
        const doctorData = response.data.data.doctor
        const userData = {
          id: doctorData.id || doctorData._id,
          name: doctorData.name || doctorData.full_name,
          mobile: doctorData.phone || doctorData.mobile || '',
          email: doctorData.email,
          role: 'doctor' as const,
          status: doctorData.status || 'Inactive'
        }
        login(userData, response.data.data.token)
        const redirect = searchParams.get('redirect')
        const go = (redirect && redirect.startsWith('/doctor')) ? redirect : '/doctor/dashboard'
        window.location.replace(go)
        return
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message
      setError(msg || 'Invalid email or password')
      if (!err.response) setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (loginType === 'patient') {
      handlePatientLogin(e)
    } else {
      handleDoctorLogin(e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      <main className="pt-20 sm:pt-24 pb-10 sm:pb-16">
        <div className="container-custom max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8"
          >
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <Image
                  src="/Physiofi Logo(1).png"
                  alt="PhysioFi"
                  width={140}
                  height={52}
                  className="object-contain mx-auto"
                  priority
                />
              </Link>
              <div className="flex justify-center mb-4">
                {loginType === 'patient' ? (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-8 w-8 text-primary-600" />
                  </div>
                )}
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                {loginType === 'patient' ? 'Patient Login' : 'Doctor Login'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="text-gray-600"
              >
                Sign in to your {loginType} account
              </motion.p>
            </div>

            {/* Login Type Selector - Patient and Doctor only */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setLoginType('patient')
                  setError('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  loginType === 'patient'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('doctor')
                  setError('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  loginType === 'doctor'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Doctor
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg text-accent-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  {loginType === 'patient' ? 'Email Address' : 'Professional Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={loginType === 'patient' ? 'Enter your email' : 'Enter your professional email'}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : `Sign In as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href={loginType === 'patient' ? '/register?type=patient' : '/register?type=doctor'} 
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
              <p className="mt-3 text-xs text-gray-400">
                Staff? <Link href="/admin/login" className="text-gray-500 hover:text-gray-700">Admin login</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
    </>
  )
}

export default LoginPage
