'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'patient'
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let response
      if (userType === 'patient') {
        response = await authAPI.patientForgotPassword(email)
      } else if (userType === 'doctor') {
        response = await authAPI.doctorForgotPassword(email)
      } else {
        response = await authAPI.adminForgotPassword(email)
      }

      if (response.data.success) {
        setSuccess(true)
        // In development, show the reset token
        if (response.data.resetToken) {
          setResetToken(response.data.resetToken)
          setResetUrl(response.data.resetUrl)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          {!success ? (
            <>
              <div className="text-center mb-8">
                <EnvelopeIcon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`${userType}@physiofi.com`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              
              {/* Development Mode - Show Reset Token */}
              {resetToken && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Development Mode - Reset Token:</p>
                  <p className="text-xs font-mono text-gray-800 break-all mb-2">{resetToken}</p>
                  <Link
                    href={resetUrl}
                    className="text-xs text-primary-600 hover:text-primary-700 break-all"
                  >
                    {resetUrl}
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default ForgotPasswordPage





