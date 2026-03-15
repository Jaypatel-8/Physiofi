'use client'

import { useEffect, useState } from 'react'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import StatsCard from '@/components/dashboard/StatsCard'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'

const DoctorAnalytics = () => {
  const { user, loading } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadAnalytics()
    }
  }, [user, loading])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getAnalytics()
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader title="Analytics" subtitle="Track your practice performance and insights" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Patients"
            value={analytics?.totalPatients || 0}
            icon={<ChartBarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <StatsCard
            title="Appointments"
            value={analytics?.totalAppointments || 0}
            icon={<ChartBarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <StatsCard
            title="Earnings"
            value={`₹${(analytics?.earnings || 0).toLocaleString()}`}
            icon={<ChartBarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatsCard
            title="Rating"
            value={analytics?.rating || '4.8'}
            icon={<ChartBarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
      </div>
    </div>
  )
}

export default DoctorAnalytics
