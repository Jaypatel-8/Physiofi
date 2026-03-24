'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI, doctorAPI, adminAPI } from '@/lib/api'

const LIMIT = 10

export default function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getAPI = useCallback(() => {
    if (!user?.role) return null
    if (user.role === 'patient') return patientAPI
    if (user.role === 'doctor') return doctorAPI
    if (user.role === 'admin') return adminAPI
    return null
  }, [user?.role])

  const fetchData = useCallback(async () => {
    const api = getAPI()
    if (!api) return
    try {
      setLoading(true)
      const [listRes, countRes] = await Promise.all([
        api.getNotifications({ limit: LIMIT }).catch(() => ({ data: { success: false } })),
        api.getUnreadCount?.() ?? (api as any).getUnreadCount?.() ?? Promise.resolve({ data: { success: false } }),
      ])
      if (listRes.data?.success && listRes.data?.data?.notifications) {
        setNotifications(listRes.data.data.notifications)
      }
      if (countRes.data?.success && countRes.data?.data?.count !== undefined) {
        setUnreadCount(countRes.data.data.count)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getAPI])

  useEffect(() => {
    if (!user?.role) return
    fetchData()
    const t = setInterval(fetchData, 60000)
    return () => clearInterval(t)
  }, [user?.role, fetchData])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = async (id: string) => {
    const api = getAPI() as any
    const fn = api?.markAsRead ?? api?.markNotificationAsRead
    if (!fn) return
    try {
      await fn(id)
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch {
      // ignore
    }
  }

  const markAllAsRead = async () => {
    const api = getAPI() as any
    const fn = api?.markAllAsRead ?? api?.markAllNotificationsAsRead
    if (!fn) return
    try {
      await fn()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const dashboardHref = user?.role === 'patient' ? '/patient/dashboard' : user?.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'

  if (!user?.role) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[min(24rem,70vh)] rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <CheckIcon className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-72">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 ${!n.isRead ? 'bg-primary-50/50' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{n.title || 'Notification'}</p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message || n.description || ''}</p>
                      {n.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(n._id)}
                        className="shrink-0 text-primary-600 hover:text-primary-700 text-xs font-medium"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className="block py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-gray-100"
          >
            View dashboard
          </Link>
        </div>
      )}
    </div>
  )
}
