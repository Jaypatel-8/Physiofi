'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import StatsCard from '@/components/dashboard/StatsCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black mb-2">Analytics</h1>
          <p className="text-white/90">Track your practice performance and insights</p>
        </div>
      </div>

      <div className="container-custom py-8">
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
      </div>
      <Footer />
    </div>
  )
}

export default DoctorAnalytics
