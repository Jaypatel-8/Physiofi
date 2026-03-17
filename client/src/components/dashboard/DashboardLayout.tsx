'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import NotificationBell from '@/components/ui/NotificationBell'
import UserAvatar from '@/components/dashboard/UserAvatar'

type Role = 'patient' | 'doctor' | 'admin'

const DASHBOARD_INDEX: Record<Role, string> = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
}

const PROFILE_HREF: Partial<Record<Role, string>> = {
  patient: '/patient/profile',
  doctor: '/doctor/profile',
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
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 sm:gap-4 h-14 px-3 sm:px-4 pl-14 sm:pl-16 lg:pl-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
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
              {PROFILE_HREF[role] ? (
                <Link
                  href={PROFILE_HREF[role]!}
                  className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 rounded-sm hover:bg-gray-50 py-1 pr-2 -my-1 transition-colors"
                  title="View profile"
                >
                  <UserAvatar name={user?.name} size="sm" />
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
                  <UserAvatar name={user?.name} size="sm" />
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-6 overflow-x-hidden">
            <div className="max-w-6xl mx-auto w-full min-w-0 px-0">
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
            <div className="container-custom py-3 flex items-center justify-between gap-4">
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <Link
                href="/patient/profile"
                className="flex items-center gap-2 rounded-lg py-1 pr-2 -my-1 hover:bg-white/60 transition-colors"
                title="View profile"
              >
                <UserAvatar name={user?.name} size="sm" />
                <span className="text-gray-700 text-sm font-medium">
                  Hi, <span className="text-primary-600 font-semibold">{displayName}</span>
                </span>
              </Link>
            </div>
          </div>
        )}

        <main className="container-custom max-w-7xl mx-auto py-6 sm:py-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
