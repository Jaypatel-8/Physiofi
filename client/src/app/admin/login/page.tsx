'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Cog6ToothIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/app/providers'

export default function AdminLoginPage() {
  const { login, user, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed?.role === 'admin') {
          window.location.replace('/admin/dashboard')
          return
        }
      } catch {
        // ignore
      }
    }
  }, [loading, user])

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await authAPI.adminLogin(formData.email.trim(), formData.password)
      if (response.data.success) {
        const adminData = response.data.data.admin
        const userData = {
          id: adminData.id || adminData._id,
          name: adminData.name || adminData.full_name,
          mobile: adminData.phone || adminData.mobile || '',
          email: adminData.email,
          role: 'admin' as const
        }
        login(userData, response.data.data.token)
        window.location.replace('/admin/dashboard')
        return
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message
      setError(msg || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-mesh">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div><div></div><div></div><div></div>
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
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-primary-200/50"
          >
            <Link href="/" className="block mb-6">
              <Image
                src="/Physiofi Logo(1).png"
                alt="PhysioFi"
                width={120}
                height={44}
                className="object-contain"
                priority
              />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to login
            </Link>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cog6ToothIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600 text-sm">Staff only. Sign in with your admin account.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  value={formData.email}
                  onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setError('') }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@physiofi.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-password"
                    value={formData.password}
                    onChange={(e) => { setFormData((p) => ({ ...p, password: e.target.value })); setError('') }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in as Admin'}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                First time? Run <code className="bg-gray-100 px-1 rounded">npm run setup</code> in the project root to create a default admin (admin@physiofi.com / admin123).
              </p>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}
