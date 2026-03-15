'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import NotificationBell from '@/components/ui/NotificationBell'

type Role = 'patient' | 'doctor' | 'admin'

const DASHBOARD_INDEX: Record<Role, string> = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
}

interface DashboardLayoutProps {
  role: Role
  children: React.ReactNode
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const dashboardHref = DASHBOARD_INDEX[role]
  const isDashboardIndex = pathname === dashboardHref
  const displayName = user?.name?.trim().split(' ')[0] || 'User'
  const isDoctorOrAdmin = role === 'doctor' || role === 'admin'

  if (isDoctorOrAdmin) {
    return (
      <div className="min-h-screen bg-[#fafbfc]">
        <DashboardSidebar role={role} />
        <div className="lg:pl-64 min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-14 px-4 pl-14 lg:pl-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            {!isDashboardIndex ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
            ) : (
              <span className="text-gray-400 text-sm font-medium">
                {role === 'doctor' ? 'Doctor' : 'Admin'} Dashboard
              </span>
            )}
            <div className="flex items-center gap-3">
              <NotificationBell />
              <span className="text-sm text-gray-500 hidden sm:inline">
                <span className="font-medium text-gray-700">{displayName}</span>
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pastel-mesh">
      <Header />
      <div className="pt-16 lg:pt-20">
        {!isDashboardIndex && (
          <div className="border-b border-primary-200/40 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="container-custom max-w-7xl mx-auto py-3 px-4 flex items-center justify-between gap-4">
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <span className="text-gray-700 text-sm font-medium">
                Hi, <span className="text-primary-600 font-semibold">{displayName}</span>
              </span>
            </div>
          </div>
        )}

        <main className="container-custom max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
