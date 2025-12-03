'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Patient {
  _id: string
  name: string
  email: string
  phone: string
  age?: number
  gender?: string
  address?: any
  profileImage?: string
  appointmentCount: number
  lastAppointment?: {
    appointmentDate: string
    appointmentTime: string
    status: string
    type: string
  }
}

export default function ViewPatientsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login')
      return
    }
    loadPatients()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadPatients, 30000)
    return () => clearInterval(interval)
  }, [user, router, pagination.current, searchTerm])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getPatients({
        page: pagination.current,
        limit: 20,
        search: searchTerm
      })
      
      if (response.data.success) {
        setPatients(response.data.data.patients)
        setPagination(response.data.data.pagination)
      }
    } catch (error: any) {
      console.error('Error loading patients:', error)
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, current: 1 }))
    loadPatients()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Confirmed': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                <UserGroupIcon className="h-10 w-10 text-primary-600" />
                <span>All Patients</span>
              </h1>
              <p className="text-gray-600">View and manage all your patients</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{pagination.total}</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </form>
        </motion.div>

        {/* Patients List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No patients found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {patients.map((patient, index) => (
              <motion.div
                key={patient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Profile Image */}
                    <div className="relative">
                      {patient.profileImage ? (
                        <Image
                          src={patient.profileImage}
                          alt={patient.name}
                          width={80}
                          height={80}
                          className="rounded-full border-4 border-primary-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {patient.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                        {patient.age && (
                          <span className="text-sm text-gray-500">({patient.age} years)</span>
                        )}
                        {patient.gender && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {patient.gender}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <EnvelopeIcon className="h-4 w-4" />
                          <span className="text-sm">{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <PhoneIcon className="h-4 w-4" />
                          <span className="text-sm">{patient.phone}</span>
                        </div>
                        {patient.address?.city && (
                          <div className="text-sm text-gray-600">
                            📍 {patient.address.city}, {patient.address.state}
                          </div>
                        )}
                      </div>

                      {/* Appointment Stats */}
                      <div className="flex items-center space-x-6 mt-4">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="h-5 w-5 text-primary-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {patient.appointmentCount} {patient.appointmentCount === 1 ? 'Appointment' : 'Appointments'}
                          </span>
                        </div>
                        {patient.lastAppointment && (
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Last: {new Date(patient.lastAppointment.appointmentDate).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short' 
                              })} at {patient.lastAppointment.appointmentTime}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.lastAppointment.status)}`}>
                              {patient.lastAppointment.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/doctor/patients/${patient._id}`}
                    className="ml-4 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <EyeIcon className="h-5 w-5" />
                    <span>View Details</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
              disabled={pagination.current === 1}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold">
              {pagination.current} / {pagination.pages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={pagination.current === pagination.pages}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}






