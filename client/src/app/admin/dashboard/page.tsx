'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserGroupIcon, CalendarDaysIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const AdminDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    monthlyRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'admin') {
      router.push('/')
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getDashboard()

      if (response.data.success) {
        setStats(response.data.data.stats || stats)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHeader title="Admin Dashboard" subtitle="Manage your physiotherapy practice" />

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-6 w-6 text-white" />}
            color="bg-primary-500"
          />
          <StatsCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={<UserGroupIcon className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            icon={<ChartBarIcon className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard
