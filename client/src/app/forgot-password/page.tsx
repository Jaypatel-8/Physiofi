'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon, UserIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'

type AccountType = 'patient' | 'doctor' | 'admin'

export default function ForgotPasswordPage() {
  const [accountType, setAccountType] = useState<AccountType>('patient')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setIsSubmitting(true)
    try {
      if (accountType === 'patient') {
        await authAPI.patientForgotPassword(email.trim())
      } else if (accountType === 'doctor') {
        await authAPI.doctorForgotPassword(email.trim())
      } else {
        await authAPI.adminForgotPassword(email.trim())
      }
      setSubmitted(true)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong. Please try again or contact us.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-pastel-mesh">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-white shadow-xl border border-primary-200/50 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-pastel-blue-50/30 pointer-events-none" />
            <div className="relative">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to login
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
              <p className="text-gray-600 mb-6">
                Choose your account type, enter your email, and we&apos;ll send you a link to reset your password.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-primary-50 border border-primary-200 p-4 flex items-start gap-3"
                >
                  <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-900">Check your email</p>
                    <p className="text-sm text-primary-700 mt-1">
                      If an account exists for {email}, we&apos;ve sent a reset link. The link expires in 10 minutes. For help,{' '}
                      <Link href="/contact" className="underline font-medium">contact us</Link>.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'patient' as const, label: 'Patient', icon: UserIcon },
                        { value: 'doctor' as const, label: 'Doctor', icon: UserGroupIcon },
                        { value: 'admin' as const, label: 'Admin', icon: Cog6ToothIcon },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAccountType(value)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-colors ${
                            accountType === value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300 text-gray-600'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-semibold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        autoComplete="email"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-gray-500">
                Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
