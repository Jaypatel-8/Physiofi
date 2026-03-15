'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'

/**
 * Role-based dashboard redirect. Used when a logged-in user hits / or /login;
 * middleware sends them here, and we send them to the correct dashboard.
 */
export default function DashboardRedirectPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (loading) return

    if (!user || !user.role) {
      router.replace('/login')
      return
    }

    const path =
      user.role === 'patient'
        ? '/patient/dashboard'
        : user.role === 'doctor'
          ? '/doctor/dashboard'
          : '/admin/dashboard'
    router.replace(path)
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-medium">Taking you to your dashboard...</p>
      </div>
    </div>
  )
}
