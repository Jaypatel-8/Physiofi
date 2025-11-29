'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  VideoCameraIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import BookingPopup from '@/components/ui/BookingPopup'

const PatientDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('home')

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent
      const type = customEvent.detail?.type === 'tele' ? 'tele' : 'home'
      setBookingType(type)
      setIsBookingOpen(true)
    }

    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true)
      // In a real app, this would fetch from your API
      setTimeout(() => {
        setUser({
          name: 'Rajesh Patel',
          email: 'rajesh.patel@email.com',
          phone: '+91 98765 43210',
          age: 45,
          address: '123, Science City Road, Ahmedabad'
        })
        
        setUpcomingAppointments([
          {
            id: 1,
            date: '2024-01-15',
            time: '10:00 AM',
            type: 'Home Visit',
            therapist: 'Dr. Arth Patel',
            status: 'Confirmed',
            service: 'Orthopedic Care'
          },
          {
            id: 2,
            date: '2024-01-18',
            time: '2:00 PM',
            type: 'Online Consultation',
            therapist: 'Dr. Prakruti Patel',
            status: 'Pending',
            service: 'Neurological Therapy'
          }
        ])
        
        setRecentAppointments([
          {
            id: 3,
            date: '2024-01-10',
            time: '11:00 AM',
            type: 'Home Visit',
            therapist: 'Dr. Rajesh Kumar',
            status: 'Completed',
            service: 'Cardiac Rehabilitation',
            notes: 'Good progress, continue exercises'
          }
        ])
        
        setIsLoading(false)
      }, 1000)
    }
    
    loadUserData()
  }, [])

  const handleBookAppointment = () => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }

  const handleViewAppointment = (appointmentId: number) => {
    const appointment = [...upcomingAppointments, ...recentAppointments].find(a => a.id === appointmentId)
    if (appointment) {
      alert(`Appointment Details:\n\nService: ${appointment.service}\nDate: ${appointment.date}\nTime: ${appointment.time}\nTherapist: ${appointment.therapist}\nType: ${appointment.type}\nStatus: ${appointment.status}`)
    }
  }

  const handleCancelAppointment = (appointmentId: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setUpcomingAppointments(upcomingAppointments.filter(a => a.id !== appointmentId))
      alert('Appointment cancelled successfully!')
    }
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">PhysioFi</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
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
          <h2 className="text-3xl font-bold mb-4">Welcome back, {user?.name}!</h2>
          <p className="text-white/90 text-lg">
            Manage your appointments and track your recovery journey with PhysioFi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 border-2 border-blue-200"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <PlusIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-700">Book New Appointment</div>
                    <div className="text-sm text-blue-600">Schedule a consultation</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
                    window.dispatchEvent(event)
                  }}
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300 border-2 border-green-200"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <VideoCameraIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-700">Online Consultation</div>
                    <div className="text-sm text-green-600">Video call with therapist</div>
                  </div>
                </button>
              </div>
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
                  {upcomingAppointments.map((appointment, index) => {
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
                            <div className="font-semibold text-gray-900">{appointment.service}</div>
                            <div className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </div>
                            <div className="text-sm text-gray-500">
                              with {appointment.therapist} • {appointment.type}
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
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                            title="Cancel Appointment"
                          >
                            <XMarkIcon className="h-5 w-5" />
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
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <button
                    onClick={handleBookAppointment}
                    className="btn-primary"
                  >
                    Book Appointment
                  </button>
                </div>
              )}
            </motion.div>

            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Appointments</h3>
              {recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.service}</div>
                            <div className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time}
                            </div>
                            <div className="text-sm text-gray-500">
                              with {appointment.therapist} • {appointment.type}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-700 mt-2 italic">
                                "{appointment.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent appointments</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium text-gray-900">{user?.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{user?.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="font-medium text-gray-900">{user?.address}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">Age</span>
                  <div className="font-medium text-gray-900">{user?.age} years</div>
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
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Sessions</span>
                  <span className="font-bold text-green-600">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming Sessions</span>
                  <span className="font-bold text-purple-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recovery Progress</span>
                  <span className="font-bold text-orange-600">85%</span>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-bold text-red-700">Emergency Contact</h3>
              </div>
              <p className="text-red-600 text-sm mb-4">
                For urgent physiotherapy needs, call our emergency line.
              </p>
              <a
                href="tel:+919998103191"
                className="text-red-600 font-semibold text-lg hover:text-red-700 transition-colors duration-300"
              >
                +91 9998103191
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        defaultServiceType={bookingType}
      />
    </div>
  )
}

export default PatientDashboard