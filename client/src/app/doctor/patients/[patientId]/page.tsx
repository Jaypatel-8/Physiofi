'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
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
  medicalHistory?: string
  emergencyContact?: any
}

interface Appointment {
  _id: string
  appointmentDate: string
  appointmentTime: string
  type: string
  status: string
  service?: any
  symptoms?: string[]
  address?: any
}

export default function PatientDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params.patientId as string
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login')
      return
    }
    loadPatientData()
    
    // Real-time updates
    const interval = setInterval(loadPatientData, 30000)
    return () => clearInterval(interval)
  }, [user, router, patientId])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getPatient(patientId)
      
      if (response.data.success) {
        setPatient(response.data.data.patient)
        setAppointments(response.data.data.appointments || [])
      }
    } catch (error: any) {
      console.error('Error loading patient:', error)
      toast.error('Failed to load patient details')
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading patient details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Patient not found</p>
            <Link href="/doctor/patients" className="text-primary-600 hover:underline mt-4 inline-block">
              Back to Patients
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <div className="container-custom py-8">
        <Link
          href="/doctor/patients"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Patients</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Patient Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                {patient.profileImage ? (
                  <Image
                    src={patient.profileImage}
                    alt={patient.name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-primary-200 mx-auto"
                  />
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                    {patient.name?.[0]?.toUpperCase() || 'P'}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mt-4">{patient.name}</h2>
                {patient.age && (
                  <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{patient.phone}</span>
                </div>
                {patient.address && (
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="text-gray-700">
                      <div>{patient.address.street}</div>
                      <div>{patient.address.city}, {patient.address.state}</div>
                      <div>{patient.address.pincode}</div>
                    </div>
                  </div>
                )}
              </div>

              {patient.medicalHistory && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Medical History</h3>
                  <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Appointment History</h3>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  {appointments.length} {appointments.length === 1 ? 'Appointment' : 'Appointments'}
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <motion.div
                      key={apt._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CalendarDaysIcon className="h-5 w-5 text-primary-600" />
                            <span className="font-semibold text-gray-900">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mb-2">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700">{apt.appointmentTime}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              {apt.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                          {apt.symptoms && apt.symptoms.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-gray-700">Symptoms: </span>
                              <span className="text-sm text-gray-600">{apt.symptoms.join(', ')}</span>
                            </div>
                          )}
                          {apt.service?.name && (
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-gray-700">Service: </span>
                              <span className="text-sm text-gray-600">{apt.service.name}</span>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/doctor/appointments/${apt._id}`}
                          className="ml-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}





