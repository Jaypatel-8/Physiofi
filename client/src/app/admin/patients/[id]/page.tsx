'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const AdminPatientDetail = () => {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  const { user, loading } = useAuth()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadPatient()
    }
  }, [user, loading, patientId])

  const loadPatient = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getPatient(patientId)
      if (response.data.success) {
        setPatient(response.data.data)
      } else {
        toast.error('Patient not found')
        router.push('/admin/patients')
      }
    } catch (error: any) {
      console.error('Error loading patient:', error)
      toast.error(error.response?.data?.message || 'Failed to load patient')
      router.push('/admin/patients')
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
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/admin/patients" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Patients</span>
          </Link>
          <h1 className="text-4xl font-black mb-2">Patient Details</h1>
          <p className="text-white/90">Complete patient information and history</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-14 w-14 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{patient.name || 'Patient'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{patient.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Age</p>
                      <p className="font-semibold text-gray-900">{patient.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="font-semibold text-gray-900">{patient.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            {patient.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Address</h3>
                <p className="text-gray-600">
                  {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.pincode}
                </p>
              </motion.div>
            )}

            {/* Emergency Contact */}
            {patient.emergencyContact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Relation</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.relation || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical History */}
            {patient.medicalHistory?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-3">
                  {patient.medicalHistory.map((history: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-gray-900 mb-1">{history.condition || 'Condition'}</p>
                      {history.diagnosis && <p className="text-sm text-gray-600 mb-1">Diagnosis: {history.diagnosis}</p>}
                      {history.treatment && <p className="text-sm text-gray-600">Treatment: {history.treatment}</p>}
                      {history.date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Date: {new Date(history.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Current Conditions */}
            {patient.currentConditions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Current Conditions</h3>
                <div className="space-y-3">
                  {patient.currentConditions.map((condition: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{condition.condition || 'Condition'}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          condition.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                          condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {condition.severity || 'Mild'}
                        </span>
                      </div>
                      {condition.notes && <p className="text-sm text-gray-600">{condition.notes}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-bold text-gray-900">{patient.totalAppointments || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recovery Progress</span>
                  <span className="font-bold text-gray-900">{patient.recoveryProgress || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {patient.status || 'Active'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/patients/${patientId}/appointments`}
                  className="block w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  View Appointments
                </Link>
                <Link
                  href="/admin/patients"
                  className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Patients
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminPatientDetail

