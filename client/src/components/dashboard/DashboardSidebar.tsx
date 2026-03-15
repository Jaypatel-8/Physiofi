'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'

type Role = 'doctor' | 'admin'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const DOCTOR_NAV: NavItem[] = [
  { name: 'Dashboard', href: '/doctor/dashboard', icon: HomeIcon },
  { name: 'Appointments', href: '/doctor/appointments', icon: CalendarDaysIcon },
  { name: 'My Patients', href: '/doctor/patients', icon: UserGroupIcon },
  { name: 'Profile', href: '/doctor/profile', icon: UserCircleIcon },
  { name: 'Prescriptions', href: '/doctor/prescriptions', icon: DocumentTextIcon },
  { name: 'Session Notes', href: '/doctor/session-notes', icon: ClipboardDocumentListIcon },
  { name: 'Availability', href: '/doctor/availability', icon: ClockIcon },
  { name: 'Conditions & Treatment', href: '/doctor/conditions', icon: BeakerIcon },
  { name: 'Exercise Plans', href: '/doctor/exercise-plans', icon: ClipboardDocumentCheckIcon },
  { name: 'Analytics', href: '/doctor/analytics', icon: ChartBarIcon },
]

const ADMIN_NAV: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarDaysIcon },
  { name: 'Assign Appointment', href: '/admin/assign-appointment', icon: UserPlusIcon },
  { name: 'Doctors', href: '/admin/doctors', icon: ShieldCheckIcon },
  { name: 'Patients', href: '/admin/patients', icon: UserGroupIcon },
  { name: 'Broadcast', href: '/admin/broadcast', icon: MegaphoneIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
]

export default function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = role === 'doctor' ? DOCTOR_NAV : ADMIN_NAV
  const displayName = user?.name?.trim().split(' ')[0] || 'User'

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link href={role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'} className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="text-lg font-bold text-primary-600">PhysioFi</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest hidden sm:block">
            {role === 'doctor' ? 'Doctor' : 'Admin'}
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== (role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard') && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 space-y-1.5">
        <div className="px-3.5 py-1.5 text-xs text-gray-400">
          <span className="font-medium text-gray-600">{displayName}</span>
        </div>
        <button
          type="button"
          onClick={() => { setMobileOpen(false); logout(); window.location.replace('/'); }}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2.5 rounded-xl bg-white/95 backdrop-blur-sm shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 max-w-[82vw] bg-white/98 backdrop-blur-md border-r border-gray-100 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] lg:shadow-none transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-3.5 right-3.5 p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 lg:hidden transition-colors"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>
    </>
  )
}
