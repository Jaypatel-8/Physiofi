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
  MapPinIcon
} from '@heroicons/react/24/outline'
import AddDoctorModal from '@/components/ui/AddDoctorModal'
import Modal from '@/components/ui/Modal'

const AdminDashboard = () => {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [stats, setStats] = useState({})
  const [recentAppointments, setRecentAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [viewingAppointment, setViewingAppointment] = useState<any>(null)

  useEffect(() => {
    // Simulate loading admin data
    const loadAdminData = async () => {
      setIsLoading(true)
      // In a real app, this would fetch from your API
      setTimeout(() => {
        setAdmin({
          name: 'Admin User',
          email: 'admin@physiofi.com',
          role: 'System Administrator'
        })
        
        setStats({
          totalPatients: 150,
          totalDoctors: 8,
          totalAppointments: 320,
          monthlyRevenue: 125000,
          pendingAppointments: 12,
          completedAppointments: 308,
          activeDoctors: 6,
          newPatientsThisMonth: 25
        })
        
        setRecentAppointments([
          {
            id: 1,
            patient: 'Rajesh Patel',
            doctor: 'Dr. Arth Patel',
            date: '2024-01-15',
            time: '10:00 AM',
            type: 'Home Visit',
            status: 'Confirmed',
            amount: 1500
          },
          {
            id: 2,
            patient: 'Sunita Sharma',
            doctor: 'Dr. Prakruti Patel',
            date: '2024-01-15',
            time: '11:00 AM',
            type: 'Online Consultation',
            status: 'Completed',
            amount: 800
          },
          {
            id: 3,
            patient: 'Amit Kumar',
            doctor: 'Dr. Rajesh Kumar',
            date: '2024-01-15',
            time: '02:00 PM',
            type: 'Home Visit',
            status: 'Pending',
            amount: 1500
          }
        ])
        
        setDoctors([
          {
            id: 1,
            name: 'Dr. Arth Patel',
            specialization: 'Orthopedic & Sports Rehabilitation',
            patients: 45,
            rating: 4.9,
            status: 'Active',
            joinDate: '2020-01-15'
          },
          {
            id: 2,
            name: 'Dr. Prakruti Patel',
            specialization: 'Neurological & Pediatric Care',
            patients: 38,
            rating: 4.8,
            status: 'Active',
            joinDate: '2020-03-20'
          },
          {
            id: 3,
            name: 'Dr. Rajesh Kumar',
            specialization: 'Cardiac & Geriatric Care',
            patients: 42,
            rating: 4.7,
            status: 'Active',
            joinDate: '2020-06-10'
          }
        ])
        
        setPatients([
          {
            id: 1,
            name: 'Rajesh Patel',
            email: 'rajesh.patel@email.com',
            phone: '+91 98765 43210',
            age: 45,
            lastVisit: '2024-01-10',
            totalAppointments: 8,
            status: 'Active'
          },
          {
            id: 2,
            name: 'Sunita Sharma',
            email: 'sunita.sharma@email.com',
            phone: '+91 98765 43211',
            age: 52,
            lastVisit: '2024-01-12',
            totalAppointments: 12,
            status: 'Active'
          },
          {
            id: 3,
            name: 'Amit Kumar',
            email: 'amit.kumar@email.com',
            phone: '+91 98765 43212',
            age: 38,
            lastVisit: '2024-01-08',
            totalAppointments: 5,
            status: 'Active'
          }
        ])
        
        setIsLoading(false)
      }, 1000)
    }
    
    loadAdminData()
  }, [])

  const handleEditDoctor = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId)
    setEditingDoctor(doctor)
  }

  const handleEditPatient = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId)
    setEditingPatient(patient)
  }

  const handleDeleteDoctor = (doctorId: number) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== doctorId))
    }
  }

  const handleDeletePatient = (patientId: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== patientId))
    }
  }

  const handleViewAppointment = (appointment: any) => {
    setViewingAppointment(appointment)
  }

  const handleDoctorAdded = (doctorData: any) => {
    // Add new doctor to the list
    const newDoctor = {
      id: doctors.length + 1,
      name: doctorData.name || 'New Doctor',
      specialization: doctorData.specialization || 'General',
      patients: 0,
      rating: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    }
    setDoctors([...doctors, newDoctor])
    alert(`Doctor ${newDoctor.name} has been added successfully!`)
  }

  if (isLoading) {
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">PhysioFi - Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {admin?.name}</span>
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-2xl p-8 text-white mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-white/90 text-lg">
            Manage your physiotherapy practice with comprehensive analytics and controls.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Active Doctors</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeDoctors}</p>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalAppointments}</p>
              </div>
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-orange-600">₹{stats.monthlyRevenue?.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Appointments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date/Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{appointment.patient}</td>
                        <td className="py-3 px-4">{appointment.doctor}</td>
                        <td className="py-3 px-4">{appointment.date} {appointment.time}</td>
                        <td className="py-3 px-4">{appointment.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Completed' 
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'Confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">₹{appointment.amount}</td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleViewAppointment(appointment)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Doctors Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Doctors Management</h3>
                <button 
                  onClick={() => setShowAddDoctor(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors duration-300 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Doctor
                </button>
              </div>
              <div className="space-y-4">
                {doctors.map((doctor, index) => {
                  const colors = [
                    { bg: 'bg-blue-100', icon: 'text-blue-500', border: 'border-blue-200' },
                    { bg: 'bg-green-100', icon: 'text-green-500', border: 'border-green-200' },
                    { bg: 'bg-purple-100', icon: 'text-purple-500', border: 'border-purple-200' },
                    { bg: 'bg-orange-100', icon: 'text-orange-500', border: 'border-orange-200' }
                  ]
                  const color = colors[index % colors.length]
                  return (
                  <div key={doctor.id} className={`border-2 ${color.border} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${color.bg} rounded-full flex items-center justify-center`}>
                          <UserGroupIcon className={`h-6 w-6 ${color.icon}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-600">{doctor.specialization}</div>
                          <div className="text-sm text-gray-500">
                            {doctor.patients} patients • Rating: {doctor.rating}/5.0
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.status === 'Active' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doctor.status}
                        </span>
                        <button
                          onClick={() => handleEditDoctor(doctor.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                          title="Edit Doctor"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                          title="Delete Doctor"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  )
                })}
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
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
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
                  <span className="font-bold text-accent-500">{stats.newPatientsThisMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-primary-500">₹{stats.monthlyRevenue?.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Patients</h3>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-600">{patient.email}</div>
                          <div className="text-sm text-gray-500">
                            {patient.totalAppointments} appointments
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditPatient(patient.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                          title="Edit Patient"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddDoctor(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                >
                  <PlusIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">Add New Doctor</span>
                </button>
                <button 
                  onClick={() => alert('Analytics feature coming soon!')}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-purple-700 font-medium">View Analytics</span>
                </button>
                <button 
                  onClick={() => alert('Appointment management feature coming soon!')}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300"
                >
                  <CalendarDaysIcon className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">Manage Appointments</span>
                </button>
                <button 
                  onClick={() => alert('Financial reports feature coming soon!')}
                  className="w-full flex items-center space-x-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-300"
                >
                  <CurrencyDollarIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-orange-700 font-medium">Financial Reports</span>
                </button>
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
        <Modal isOpen={!!editingDoctor} onClose={() => setEditingDoctor(null)} title="Edit Doctor" size="lg">
          <div className="space-y-4">
            <p className="text-gray-600">Edit functionality for {editingDoctor.name} coming soon!</p>
            <button 
              onClick={() => setEditingDoctor(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {viewingAppointment && (
        <Modal isOpen={!!viewingAppointment} onClose={() => setViewingAppointment(null)} title="Appointment Details" size="md">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-semibold text-gray-900">{viewingAppointment.patient}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-semibold text-gray-900">{viewingAppointment.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold text-gray-900">{viewingAppointment.date} at {viewingAppointment.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900">{viewingAppointment.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-semibold text-gray-900">₹{viewingAppointment.amount}</p>
            </div>
            <button 
              onClick={() => setViewingAppointment(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard