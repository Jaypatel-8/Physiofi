'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    // If the page was accessed directly via URL, redirect to home after a short delay
    const referrer = document.referrer
    if (!referrer || referrer === window.location.href) {
      // No referrer means direct access, but we'll still show the 404 page
      // User can choose to go home or back
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(6,182,212,0.12),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/50">
        <div className="text-6xl font-black text-primary-500 mb-4 font-display">404</div>
        <h1 className="text-2xl font-black text-gray-900 mb-4 font-display">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

