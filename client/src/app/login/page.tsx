'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const LoginPage = () => {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'patient' | 'doctor' | 'admin'>('patient')
  const [step, setStep] = useState<'login' | 'otp' | 'success'>('login')
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    otp: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (formData.phone === '+919998103191') {
        setStep('otp')
      } else {
        setError('Phone number not found. Please register first.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (formData.email === 'arth.patel@physiofi.com' && formData.password === 'doctor123') {
        setStep('success')
        setTimeout(() => {
          router.push('/doctor/dashboard')
        }, 2000)
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (formData.email === 'admin@physiofi.com' && formData.password === 'admin123') {
        setStep('success')
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (formData.otp === '123456') {
        setStep('success')
        setTimeout(() => {
          router.push('/patient/dashboard')
        }, 2000)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = () => {
    // Simulate resending OTP
    console.log('OTP resent to', formData.phone)
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

          {/* Login Type Selector */}
          {step === 'login' && (
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
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
              <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
          )}

          {/* OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div className="text-center">
                <PhoneIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
                <p className="text-gray-600">
                  We've sent a 6-digit code to <br />
                  <span className="font-semibold">{formData.phone}</span>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Login</span>
              </button>
            </form>
          )}

          {/* Login Forms */}
          {step === 'login' && (
            <>
              {/* Patient Login */}
              {loginType === 'patient' && (
                <form onSubmit={handlePatientLogin} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => router.push('/register')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Doctor Login */}
              {loginType === 'doctor' && (
                <form onSubmit={handleDoctorLogin} className="space-y-6">
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
                        placeholder="doctor@physiofi.com"
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

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
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
                      New doctor?{' '}
                      <button
                        type="button"
                        onClick={() => router.push('/register')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Admin Login */}
              {loginType === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-6">
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
                        placeholder="admin@physiofi.com"
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

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Demo Credentials */}
          {step === 'login' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Patient:</strong> Use phone +919998103191</p>
                <p><strong>Doctor:</strong> arth.patel@physiofi.com / doctor123</p>
                <p><strong>Admin:</strong> admin@physiofi.com / admin123</p>
                <p><strong>OTP:</strong> 123456 (for testing)</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginPage