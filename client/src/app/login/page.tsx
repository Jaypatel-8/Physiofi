'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/app/providers'

const LoginPage = () => {
  const router = useRouter()
  const { login, user, loading } = useAuth()
  const [loginType, setLoginType] = useState<'patient' | 'doctor' | 'admin'>('patient')
  const [step, setStep] = useState<'login' | 'success'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      const dashboardPath = user.role === 'patient' 
        ? '/patient/dashboard' 
        : user.role === 'doctor' 
        ? '/doctor/dashboard' 
        : '/admin/dashboard'
      router.push(dashboardPath)
    }
  }, [user, loading, router])

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
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.patientLogin(formData.email, formData.password)
      if (response.data.success) {
        const patientData = response.data.data.patient
        const userData = {
          id: patientData.id || patientData._id,
          name: patientData.name,
          mobile: patientData.phone || patientData.mobile || '',
          email: patientData.email,
          role: 'patient' as const
        }
        login(userData, response.data.data.token)
        // Redirect immediately to dashboard
        router.push('/patient/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.doctorLogin(formData.email, formData.password)
      if (response.data.success) {
        const doctorData = response.data.data.doctor
        const userData = {
          id: doctorData.id || doctorData._id,
          name: doctorData.name,
          mobile: doctorData.phone || doctorData.mobile || '',
          email: doctorData.email,
          role: 'doctor' as const
        }
        login(userData, response.data.data.token)
        // Redirect immediately to dashboard
        router.push('/doctor/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.adminLogin(formData.email, formData.password)
      if (response.data.success) {
        const adminData = response.data.data.admin
        const userData = {
          id: adminData.id || adminData._id,
          name: adminData.name,
          mobile: adminData.phone || adminData.mobile || '',
          email: adminData.email,
          role: 'admin' as const
        }
        login(userData, response.data.data.token)
        // Redirect immediately to dashboard
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (loginType === 'patient') {
      handlePatientLogin(e)
    } else if (loginType === 'doctor') {
      handleDoctorLogin(e)
    } else {
      handleAdminLogin(e)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if already logged in (redirect will happen)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-32"></div>
      
      <div className="max-w-md mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your PhysioFi account</p>
          </div>

          {/* Success State - This should rarely show now since we redirect immediately */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
              <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
              <button
                onClick={() => {
                  const dashboardPath = loginType === 'patient' 
                    ? '/patient/dashboard' 
                    : loginType === 'doctor' 
                    ? '/doctor/dashboard' 
                    : '/admin/dashboard'
                  router.push(dashboardPath)
                  router.refresh()
                }}
                className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Login Form */}
          {step === 'login' && (
            <>
              {/* Login Type Selector */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setLoginType('patient')}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                      loginType === 'patient'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    onClick={() => setLoginType('doctor')}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                      loginType === 'doctor'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Doctor
                  </button>
                  <button
                    onClick={() => setLoginType('admin')}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                      loginType === 'admin'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`${loginType}@physiofi.com`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href={`/forgot-password?type=${loginType}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginPage
