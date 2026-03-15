'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LockClosedIcon, ArrowLeftIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'

type AccountType = 'patient' | 'doctor' | 'admin'

const VALID_TYPES: AccountType[] = ['patient', 'doctor', 'admin']

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [type, setType] = useState<AccountType | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = searchParams.get('token')
    const ty = searchParams.get('type')
    if (t) setToken(t)
    if (ty && VALID_TYPES.includes(ty as AccountType)) setType(ty as AccountType)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!token || !type) {
      setError('Invalid or expired reset link. Please request a new one.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      if (type === 'patient') {
        await authAPI.patientResetPassword(token, password)
      } else if (type === 'doctor') {
        await authAPI.doctorResetPassword(token, password)
      } else {
        await authAPI.adminResetPassword(token, password)
      }
      setSuccess(true)
      setTimeout(() => router.replace('/login'), 2500)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password. The link may have expired.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (typeof window !== 'undefined' && !token && !searchParams.get('token')) {
    return (
      <div className="min-h-screen flex flex-col bg-pastel-mesh">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md w-full rounded-2xl bg-white shadow-xl border border-primary-200/50 p-8 text-center"
          >
            <p className="text-gray-600 mb-4">Loading...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  const invalidLink = !token || !type

  return (
    <>
    <div className="min-h-screen flex flex-col bg-pastel-mesh">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-white shadow-xl border border-primary-200/50 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-pastel-mint-50/30 pointer-events-none" />
            <div className="relative">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to login
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h1>
              <p className="text-gray-600 mb-6">
                {invalidLink
                  ? 'This link is invalid or has expired. Request a new reset link from the login page.'
                  : 'Enter your new password below.'}
              </p>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-primary-50 border border-primary-200 p-4 flex items-start gap-3"
                >
                  <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-900">Password reset successfully</p>
                    <p className="text-sm text-primary-700 mt-1">Redirecting you to login...</p>
                  </div>
                </motion.div>
              ) : invalidLink ? (
                <Link
                  href="/forgot-password"
                  className="inline-block w-full text-center bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Request new reset link
                </Link>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      New password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Resetting…' : 'Reset password'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}
