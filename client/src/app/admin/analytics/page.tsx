'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import StatsCard from '@/components/dashboard/StatsCard'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'

const AdminAnalytics = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      loadAnalytics()
    }
  }, [user, loading, router])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getAnalytics()
      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Analytics" subtitle="Loading..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="site-card p-4 h-24 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
      <DashboardSubPageHeader
        title="Analytics"
        subtitle="Track platform performance and insights"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`₹${(analytics?.totalRevenue || 0).toLocaleString()}`}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color=""
          index={0}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${(analytics?.monthlyRevenue || 0).toLocaleString()}`}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color=""
          index={1}
        />
        <StatsCard
          title="Total Appointments"
          value={analytics?.totalAppointments || 0}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color=""
          index={2}
        />
        <StatsCard
          title="Active Users"
          value={analytics?.activeUsers || 0}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color=""
          index={3}
        />
      </div>
    </div>
    </>
  )
}

export default AdminAnalytics
