'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Allow /admin/login without auth – no redirect, no dashboard shell
  const isAdminLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isAdminLoginPage) return
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
    if (!role || role !== 'admin') {
      router.replace('/admin/login')
    }
  }, [user, loading, router, isAdminLoginPage])

  if (isAdminLoginPage) {
    return <>{children}</>
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

  if (!user || user.role !== 'admin') {
    return null
  }

  return <DashboardLayout role="admin">{children}</DashboardLayout>
}
