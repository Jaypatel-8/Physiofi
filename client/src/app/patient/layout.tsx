'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    let role: string | null = user?.role ?? null
    if (!role && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        role = parsed?.role ?? null
      } catch {
        role = null
      }
    }
    if (!role || role !== 'patient') {
      router.replace('/login')
    }
  }, [user, loading, router])

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

  if (!user || user.role !== 'patient') {
    return null
  }

  return <DashboardLayout role="patient">{children}</DashboardLayout>
}
