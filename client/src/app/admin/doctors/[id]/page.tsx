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
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  StarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
import toast from 'react-hot-toast'

const AdminDoctorDetail = () => {
  const router = useRouter()
  const params = useParams()
  const doctorId = params.id as string
  const { user, loading } = useAuth()
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      loadDoctor()
    }
  }, [user, loading, doctorId, router])

  const loadDoctor = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getDoctor(doctorId)
      if (response.data.success) {
        setDoctor(response.data.data)
      } else {
        toast.error('Doctor not found')
        router.push('/admin/doctors')
      }
    } catch (error: any) {
      console.error('Error loading doctor:', error)
      toast.error(error.response?.data?.message || 'Failed to load doctor')
      router.push('/admin/doctors')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Doctor Details" subtitle="Loading..." />
        <div className="site-card p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return null
  }

  const doctorName = doctor.name || doctor.full_name
  const subtitle = doctorName ? `Dr. ${doctorName}` : 'Complete doctor information'

  return (
    <div className="space-y-6">
      <Link href="/admin/doctors" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Doctors
      </Link>
      <DashboardSubPageHeader title="Doctor Details" subtitle={subtitle} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="site-card p-6"
          >
            <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-14 w-14 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Dr. {doctor.name || 'Doctor'}</h2>
                  <p className="text-gray-600 mb-4">{doctor.specialization?.[0] || 'Physiotherapist'}</p>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-gray-900">{doctor.rating?.average?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-600">({doctor.rating?.count || 0} reviews)</span>
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{doctor.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{doctor.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{doctor.experience || 0} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {doctor.status || 'Active'}
                  </span>
                </div>
            </div>
          </motion.div>

            {/* Specialization */}
            {doctor.specialization?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialization.map((spec: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Qualifications */}
            {doctor.qualifications?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Qualifications</h3>
                <div className="space-y-3">
                  {doctor.qualifications.map((qual: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-gray-900">{qual.degree || 'Degree'}</p>
                      {qual.institution && <p className="text-sm text-gray-600">{qual.institution}</p>}
                      {qual.year && <p className="text-sm text-gray-500">Year: {qual.year}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Address */}
            {doctor.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Address</h3>
                <p className="text-gray-600">
                  {doctor.address.street}, {doctor.address.city}, {doctor.address.state} {doctor.address.pincode}
                </p>
              </motion.div>
            )}

            {/* Bio */}
            {doctor.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Bio</h3>
                <p className="text-gray-600">{doctor.bio}</p>
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
              className="site-card p-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-bold text-gray-900">{doctor.totalPatients || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-bold text-gray-900">{doctor.totalSessions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-gray-900">{doctor.rating?.average?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Join Date</span>
                  <span className="font-semibold text-gray-900">
                    {doctor.joinDate ? new Date(doctor.joinDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="site-card p-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/doctors/${doctorId}/appointments`}
                  className="block w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  View Appointments
                </Link>
                <Link
                  href="/admin/doctors"
                  className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Doctors
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDoctorDetail

