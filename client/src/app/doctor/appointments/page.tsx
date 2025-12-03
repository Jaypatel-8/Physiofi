'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  HomeIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import toast from 'react-hot-toast'

interface Appointment {
  _id: string
  appointmentDate: string | Date
  appointmentTime: string
  type: 'Home Visit' | 'Online Consultation' | 'Clinic Visit'
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled'
  service?: {
    name?: string
    price?: number
    duration?: number
  }
  patient?: {
    _id?: string
    name?: string
    email?: string
    phone?: string
    age?: number
  }
  address?: any
  symptoms?: string[]
}

export default function ManageAppointmentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login')
      return
    }
    loadAppointments()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadAppointments, 30000)
    return () => clearInterval(interval)
  }, [user, router])

  useEffect(() => {
    filterAppointments()
  }, [appointments, statusFilter, typeFilter, dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getAppointments()
      
      if (response.data.success) {
        setAppointments(response.data.data.appointments || [])
      }
    } catch (error: any) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = [...appointments]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt.type === typeFilter)
    }

    // Date filter
    if (dateFilter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate.getTime() === today.getTime()
      })
    } else if (dateFilter === 'upcoming') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate.getTime() >= today.getTime() && apt.status !== 'Completed' && apt.status !== 'Cancelled'
      })
    } else if (dateFilter === 'past') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate.getTime() < today.getTime() || apt.status === 'Completed'
      })
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime()
      const dateB = new Date(b.appointmentDate).getTime()
      return dateA - dateB
    })

    setFilteredAppointments(filtered)
  }

  const handleAction = async (appointmentId: string, action: string) => {
    try {
      let newStatus = ''
      if (action === 'accept') {
        newStatus = 'Confirmed'
      } else if (action === 'decline') {
        newStatus = 'Cancelled'
      } else {
        newStatus = action
      }
      
      await doctorAPI.updateAppointmentStatus(appointmentId, newStatus)
      toast.success('Appointment status updated')
      loadAppointments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    today: appointments.filter(a => {
      const today = new Date()
      const aptDate = new Date(a.appointmentDate)
      return today.toDateString() === aptDate.toDateString()
    }).length
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <CalendarDaysIcon className="h-10 w-10 text-primary-600" />
            <span>Manage Appointments</span>
          </h1>
          <p className="text-gray-600">View and manage all your appointments</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-lg border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-lg border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.confirmed}</div>
            <div className="text-sm text-blue-600">Confirmed</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 shadow-lg border-2 border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 shadow-lg border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{stats.today}</div>
            <div className="text-sm text-purple-600">Today</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Home Visit">Home Visit</option>
                <option value="Online Consultation">Tele Consultation</option>
                <option value="Clinic Visit">Clinic Visit</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onAction={handleAction}
                userRole="doctor"
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

