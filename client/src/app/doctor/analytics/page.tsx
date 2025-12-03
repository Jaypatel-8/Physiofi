'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import toast from 'react-hot-toast'

interface AnalyticsData {
  period: string
  appointmentStats: Array<{ _id: { status: string; type: string }; count: number }>
  dailyAppointments: Array<{ _id: string; count: number; completed: number }>
  revenue: { totalRevenue: number; averageRevenue: number }
  patientGrowth: Array<{ month: string; newPatientsCount: number }>
  summary: {
    totalAppointments: number
    completedAppointments: number
    totalRevenue: number
  }
}

export default function ViewAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<string>('month')

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login')
      return
    }
    loadAnalytics()
    
    // Real-time updates every 60 seconds
    const interval = setInterval(loadAnalytics, 60000)
    return () => clearInterval(interval)
  }, [user, router, period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getAnalytics(period)
      
      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const getStatusCount = (status: string) => {
    if (!analytics) return 0
    const stat = analytics.appointmentStats.find(s => s._id.status === status)
    return stat?.count || 0
  }

  const getTypeCount = (type: string) => {
    if (!analytics) return 0
    const stat = analytics.appointmentStats.find(s => s._id.type === type)
    return stat?.count || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No analytics data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                <ChartBarIcon className="h-10 w-10 text-primary-600" />
                <span>Analytics Dashboard</span>
              </h1>
              <p className="text-gray-600">View your performance metrics and statistics</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none font-semibold"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.summary.totalAppointments}</p>
              </div>
              <CalendarDaysIcon className="h-12 w-12 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.summary.completedAppointments}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.summary.totalAppointments > 0
                    ? Math.round((analytics.summary.completedAppointments / analytics.summary.totalAppointments) * 100)
                    : 0}% completion rate
                </p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{analytics.summary.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: ₹{analytics.revenue.averageRevenue.toFixed(0)}
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">New Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.patientGrowth.reduce((sum, p) => sum + p.newPatientsCount, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This {period}</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Status</h3>
            <div className="space-y-4">
              {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => {
                const count = getStatusCount(status)
                const total = analytics.summary.totalAppointments
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{status}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          status === 'Completed' ? 'bg-green-500' :
                          status === 'Confirmed' ? 'bg-blue-500' :
                          status === 'Pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Appointment Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Types</h3>
            <div className="space-y-4">
              {['Home Visit', 'Online Consultation', 'Clinic Visit'].map(type => {
                const count = getTypeCount(type)
                const total = analytics.summary.totalAppointments
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{type}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-primary-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Daily Appointments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Appointments</h3>
          <div className="space-y-3">
            {analytics.dailyAppointments.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No appointments in this period</p>
            ) : (
              analytics.dailyAppointments.map((day, index) => {
                const maxCount = Math.max(...analytics.dailyAppointments.map(d => d.count), 1)
                const width = (day.count / maxCount) * 100
                return (
                  <div key={day._id} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-600 font-semibold">
                      {new Date(day._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="bg-primary-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${width}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{day.count}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.completed} completed
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>

        {/* Patient Growth */}
        {analytics.patientGrowth.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Growth</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {analytics.patientGrowth.map((growth, index) => (
                <div key={growth.month} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-2">{growth.month}</div>
                  <div className="text-2xl font-bold text-primary-700">{growth.newPatientsCount}</div>
                  <div className="text-xs text-gray-500 mt-1">new patients</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

