'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  VideoCameraIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const DoctorDashboard = () => {
  const router = useRouter()
  const [doctor, setDoctor] = useState(null)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading doctor data
    const loadDoctorData = async () => {
      setIsLoading(true)
      // In a real app, this would fetch from your API
      setTimeout(() => {
        setDoctor({
          name: 'Dr. Arth Patel',
          email: 'arth.patel@physiofi.com',
          phone: '+91 98765 43210',
          specialization: 'Orthopedic & Sports Rehabilitation',
          experience: '8+ years',
          license: 'MPT-12345',
          rating: 4.9,
          totalPatients: 150
        })
        
        setTodayAppointments([
          {
            id: 1,
            time: '09:00 AM',
            patient: 'Rajesh Patel',
            type: 'Home Visit',
            service: 'Orthopedic Care',
            status: 'Confirmed',
            address: '123, Science City Road, Ahmedabad',
            phone: '+91 98765 43210'
          },
          {
            id: 2,
            time: '11:00 AM',
            patient: 'Sunita Sharma',
            type: 'Online Consultation',
            service: 'Neurological Therapy',
            status: 'Confirmed',
            phone: '+91 98765 43211'
          },
          {
            id: 3,
            time: '02:00 PM',
            patient: 'Amit Kumar',
            type: 'Home Visit',
            service: 'Sports Rehabilitation',
            status: 'Pending',
            address: '456, Vastrapur, Ahmedabad',
            phone: '+91 98765 43212'
          }
        ])
        
        setUpcomingAppointments([
          {
            id: 4,
            date: '2024-01-16',
            time: '10:00 AM',
            patient: 'Meera Desai',
            type: 'Home Visit',
            service: 'Cardiac Rehabilitation',
            status: 'Confirmed'
          },
          {
            id: 5,
            date: '2024-01-17',
            time: '03:00 PM',
            patient: 'Vikram Singh',
            type: 'Online Consultation',
            service: 'Orthopedic Care',
            status: 'Pending'
          }
        ])
        
        setRecentPatients([
          {
            id: 1,
            name: 'Priya Agarwal',
            lastVisit: '2024-01-12',
            service: 'Neurological Therapy',
            progress: 'Good',
            nextAppointment: '2024-01-20'
          },
          {
            id: 2,
            name: 'Rahul Purohit',
            lastVisit: '2024-01-11',
            service: 'Sports Rehabilitation',
            progress: 'Excellent',
            nextAppointment: '2024-01-18'
          }
        ])
        
        setIsLoading(false)
      }, 1000)
    }
    
    loadDoctorData()
  }, [])

  const handleViewAppointment = (appointmentId: number) => {
    const appointment = [...todayAppointments, ...upcomingAppointments].find(a => a.id === appointmentId)
    if (appointment) {
      alert(`Appointment Details:\n\nPatient: ${appointment.patient}\nDate: ${appointment.date || 'Today'}\nTime: ${appointment.time}\nService: ${appointment.service}\nType: ${appointment.type}\nStatus: ${appointment.status}${appointment.address ? `\nAddress: ${appointment.address}` : ''}`)
    }
  }

  const handleStartSession = (appointmentId: number) => {
    const appointment = todayAppointments.find(a => a.id === appointmentId)
    if (appointment) {
      if (confirm(`Start session with ${appointment.patient}?`)) {
        alert(`Session started with ${appointment.patient}!\n\nService: ${appointment.service}\nTime: ${appointment.time}`)
      }
    }
  }

  const handleAddNotes = () => {
    const patientName = prompt('Enter patient name:')
    if (patientName) {
      const notes = prompt('Enter notes:')
      if (notes) {
        alert(`Notes added for ${patientName}:\n${notes}`)
      }
    }
  }

  const handleViewAnalytics = () => {
    alert('Analytics Dashboard:\n\nTotal Patients: 150\nCompleted Sessions: 142\nAverage Rating: 4.9\nThis Month Revenue: ₹2,25,000')
  }

  const handleViewMessages = () => {
    alert('Patient Messages:\n\n1. Rajesh Patel - "Thank you for the session!"\n2. Sunita Sharma - "Can we reschedule?"\n3. Amit Kumar - "Feeling much better!"')
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
          <p className="text-gray-600">Loading your dashboard...</p>
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">PhysioFi - Doctor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {doctor?.name}</span>
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
          <h2 className="text-3xl font-bold mb-4">Welcome back, {doctor?.name}!</h2>
          <p className="text-white/90 text-lg">
            Manage your appointments and provide exceptional care to your patients.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Today's Appointments</h3>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => {
                    const colors = [
                      { bg: 'bg-blue-100', icon: 'text-blue-500' },
                      { bg: 'bg-green-100', icon: 'text-green-500' },
                      { bg: 'bg-purple-100', icon: 'text-purple-500' }
                    ]
                    const color = colors[index % colors.length]
                    return (
                    <div
                      key={appointment.id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${color.bg} rounded-full flex items-center justify-center`}>
                            <CalendarDaysIcon className={`h-6 w-6 ${color.icon}`} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.patient}</div>
                            <div className="text-sm text-gray-600">
                              {appointment.time} • {appointment.service}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.type} {appointment.address && `• ${appointment.address}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {appointment.status}
                          </span>
                          <button
                            onClick={() => handleStartSession(appointment.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors duration-300"
                          >
                            Start Session
                          </button>
                          <button
                            onClick={() => handleViewAppointment(appointment.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
              )}
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Appointments</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                            <ClockIcon className="h-6 w-6 text-accent-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.patient}</div>
                            <div className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.service} • {appointment.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {appointment.status}
                          </span>
                          <button
                            onClick={() => handleViewAppointment(appointment.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                </div>
              )}
            </motion.div>

            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Patients</h3>
              {recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-600">
                              Last visit: {patient.lastVisit}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.service} • Progress: {patient.progress}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Next appointment</div>
                          <div className="text-sm font-medium text-gray-900">{patient.nextAppointment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent patients</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Doctor Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium text-gray-900">{doctor?.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">Specialization</span>
                  <div className="font-medium text-gray-900">{doctor?.specialization}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">Experience</span>
                  <div className="font-medium text-gray-900">{doctor?.experience}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">License</span>
                  <div className="font-medium text-gray-900">{doctor?.license}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="font-medium text-gray-900">{doctor?.rating}/5.0</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-bold text-blue-600">{doctor?.totalPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Appointments</span>
                  <span className="font-bold text-green-600">{todayAppointments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Sessions</span>
                  <span className="font-bold text-purple-600">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-bold text-orange-600">{doctor?.rating}/5.0</span>
                </div>
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
                  onClick={handleAddNotes}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 border-2 border-blue-200"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-blue-700 font-medium">Add Patient Notes</span>
                </button>
                <button 
                  onClick={handleViewAnalytics}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 border-2 border-purple-200"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">View Analytics</span>
                </button>
                <button 
                  onClick={handleViewMessages}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300 border-2 border-green-200"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-green-700 font-medium">Patient Messages</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard