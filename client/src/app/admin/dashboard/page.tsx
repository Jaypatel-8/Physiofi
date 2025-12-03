'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI, appointmentAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import AddDoctorModal from '@/components/ui/AddDoctorModal'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

const AdminDashboard = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [adminData, setAdminData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeDoctors: 0,
    newPatientsThisMonth: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [viewingAppointment, setViewingAppointment] = useState<any>(null)

  // Real-time data fetching
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadDashboardData()

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(loadDashboardData, 30000)

    return () => clearInterval(interval)
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch dashboard data
      const dashboardResponse = await adminAPI.getDashboard()
      const dashboardData = dashboardResponse.data.data || dashboardResponse.data

      setStats({
        totalPatients: dashboardData.stats?.totalPatients || 0,
        totalDoctors: dashboardData.stats?.totalDoctors || 0,
        totalAppointments: dashboardData.stats?.totalAppointments || 0,
        monthlyRevenue: dashboardData.stats?.monthlyRevenue || 0,
        pendingAppointments: dashboardData.stats?.pendingAppointments || 0,
        completedAppointments: dashboardData.stats?.completedAppointments || 0,
        activeDoctors: dashboardData.stats?.activeDoctors || 0,
        newPatientsThisMonth: dashboardData.stats?.newPatientsThisMonth || 0
      })

      // Fetch recent appointments
      const appointmentsResponse = await adminAPI.getAppointments({ limit: 10 })
      const appointments = appointmentsResponse.data.data?.appointments || appointmentsResponse.data.appointments || []
      setRecentAppointments(appointments)

      // Fetch doctors
      const doctorsResponse = await adminAPI.getDoctors({ limit: 10 })
      const doctorsData = doctorsResponse.data.data?.doctors || doctorsResponse.data.doctors || []
      setDoctors(doctorsData)

      // Fetch patients
      const patientsResponse = await adminAPI.getPatients({ limit: 10 })
      const patientsData = patientsResponse.data.data?.patients || patientsResponse.data.patients || []
      setPatients(patientsData)

    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDoctor = (doctorId: string) => {
    const doctor = doctors.find(d => d._id === doctorId || d.id === doctorId)
    setEditingDoctor(doctor)
  }

  const handleEditPatient = (patientId: string) => {
    const patient = patients.find(p => p._id === patientId || p.id === patientId)
    setEditingPatient(patient)
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return

    try {
      await adminAPI.deleteDoctor(doctorId)
      toast.success('Doctor deleted successfully')
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor')
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return

    try {
      await adminAPI.deletePatient(patientId)
      toast.success('Patient deleted successfully')
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete patient')
    }
  }

  const handleViewAppointment = async (appointmentId: string) => {
    try {
      const response = await adminAPI.getAppointment(appointmentId)
      const appointment = response.data.data || response.data
      setViewingAppointment(appointment)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load appointment details')
    }
  }

  const handleDoctorAdded = async (doctorData: any) => {
    try {
      // The AddDoctorModal should handle the API call
      toast.success('Doctor added successfully!')
      setShowAddDoctor(false)
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add doctor')
    }
  }

  if (isLoading && !adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <DashboardHeader title="Admin Dashboard" subtitle="Manage your physiotherapy practice" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4 font-display">Admin Dashboard</h2>
            <p className="text-white/90 text-lg max-w-2xl">
              Manage your physiotherapy practice with comprehensive analytics and controls.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-7 w-7" />}
            color="primary"
            delay={0.1}
          />
          <StatsCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={<UserCircleIcon className="h-7 w-7" />}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="purple"
            delay={0.3}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={<CurrencyDollarIcon className="h-7 w-7" />}
            color="orange"
            delay={0.4}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-black text-gray-900 font-display">Recent Appointments</h3>
                <Link
                  href="/admin/appointments"
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4 relative z-10">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || appointment.id || index}
                      appointment={appointment}
                      userRole="admin"
                      onView={handleViewAppointment}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent appointments</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Doctors Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-black text-gray-900 font-display">Doctors Management</h3>
                <div className="flex items-center space-x-2">
                  <Link
                    href="/admin/doctors"
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    View All
                  </Link>
                  <button
                    onClick={() => setShowAddDoctor(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors duration-300 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Doctor
                  </button>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => {
                    const colors = [
                      { bg: 'bg-primary-100', icon: 'text-primary-600', border: 'border-primary-200' },
                      { bg: 'bg-secondary-100', icon: 'text-secondary-600', border: 'border-secondary-200' },
                      { bg: 'bg-accent-100', icon: 'text-accent-600', border: 'border-accent-200' },
                      { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-200' }
                    ]
                    const color = colors[index % colors.length]
                    const doctorId = doctor._id || doctor.id
                    return (
                      <div
                        key={doctorId || index}
                        className={`border-2 ${color.border} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${color.bg} rounded-full flex items-center justify-center`}>
                              <UserGroupIcon className={`h-6 w-6 ${color.icon}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{doctor.name}</div>
                              <div className="text-sm text-gray-600">
                                {Array.isArray(doctor.specialization)
                                  ? doctor.specialization.join(', ')
                                  : doctor.specialization || 'General'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {doctor.totalPatients || 0} patients • Rating:{' '}
                                {doctor.rating?.average?.toFixed(1) || 'N/A'}/5.0
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doctor.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {doctor.status || 'Active'}
                            </span>
                            <button
                              onClick={() => handleEditDoctor(doctorId)}
                              className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-300"
                              title="Edit Doctor"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doctorId)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                              title="Delete Doctor"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No doctors found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Appointments</span>
                    <span className="font-bold text-yellow-500">{stats.pendingAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed Appointments</span>
                    <span className="font-bold text-green-500">{stats.completedAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Patients (This Month)</span>
                    <span className="font-bold text-primary-500">{stats.newPatientsThisMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-primary-500">₹{stats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900 font-display">Recent Patients</h3>
                  <Link
                    href="/admin/patients"
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {patients.length > 0 ? (
                    patients.map((patient, index) => {
                      const patientId = patient._id || patient.id
                      return (
                        <div key={patientId || index} className="border-2 border-gray-100 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <UserGroupIcon className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{patient.name}</div>
                                <div className="text-sm text-gray-600">{patient.email}</div>
                                <div className="text-sm text-gray-500">
                                  {patient.totalAppointments || 0} appointments
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditPatient(patientId)}
                                className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-300"
                                title="Edit Patient"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePatient(patientId)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-300"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No patients found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddDoctor(true)}
                    className="w-full flex items-center space-x-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300 border-2 border-primary-200"
                  >
                    <PlusIcon className="h-5 w-5 text-primary-500" />
                    <span className="text-primary-700 font-medium">Add New Doctor</span>
                  </button>
                  <Link
                    href="/admin/analytics"
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 border-2 border-purple-200"
                  >
                    <ChartBarIcon className="h-5 w-5 text-purple-500" />
                    <span className="text-purple-700 font-medium">View Analytics</span>
                  </Link>
                  <Link
                    href="/admin/appointments"
                    className="w-full flex items-center space-x-3 p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors duration-300 border-2 border-secondary-200"
                  >
                    <CalendarDaysIcon className="h-5 w-5 text-secondary-500" />
                    <span className="text-secondary-700 font-medium">Manage Appointments</span>
                  </Link>
                  <Link
                    href="/admin/reports"
                    className="w-full flex items-center space-x-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-300 border-2 border-orange-200"
                  >
                    <CurrencyDollarIcon className="h-5 w-5 text-orange-500" />
                    <span className="text-orange-700 font-medium">Financial Reports</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDoctorModal
        isOpen={showAddDoctor}
        onClose={() => setShowAddDoctor(false)}
        onSuccess={handleDoctorAdded}
      />

      {editingDoctor && (
        <Modal
          isOpen={!!editingDoctor}
          onClose={() => setEditingDoctor(null)}
          title="Edit Doctor"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">Edit functionality for {editingDoctor.name} coming soon!</p>
            <button onClick={() => setEditingDoctor(null)} className="btn-primary w-full">
              Close
            </button>
          </div>
        </Modal>
      )}

      {viewingAppointment && (
        <Modal
          isOpen={!!viewingAppointment}
          onClose={() => setViewingAppointment(null)}
          title="Appointment Details"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-semibold text-gray-900">
                {viewingAppointment.patient?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-semibold text-gray-900">
                {viewingAppointment.doctor?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(viewingAppointment.appointmentDate).toLocaleDateString()} at{' '}
                {viewingAppointment.appointmentTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900">{viewingAppointment.type}</p>
            </div>
            {viewingAppointment.payment?.amount && (
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-gray-900">₹{viewingAppointment.payment.amount}</p>
              </div>
            )}
            <button onClick={() => setViewingAppointment(null)} className="btn-primary w-full">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard
