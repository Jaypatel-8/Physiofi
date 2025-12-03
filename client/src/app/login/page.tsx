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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Login Type Selector */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginType('patient')}
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
                onClick={() => setLoginType('doctor')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  loginType === 'doctor'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  loginType === 'admin'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
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
                className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
