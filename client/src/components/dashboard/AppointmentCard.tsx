'use client'

import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AppointmentCardProps {
  appointment: {
    _id?: string
    id?: string
    appointmentDate: string | Date
    appointmentTime: string
    type: 'Home Visit' | 'Online Consultation' | 'Clinic Visit'
    status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled'
    service?: {
      name?: string
    }
    patient?: {
      name?: string
      email?: string
      phone?: string
    }
    doctor?: {
      name?: string
      specialization?: string
    }
    address?: {
      street?: string
      city?: string
      state?: string
    }
    notes?: {
      doctor?: string
      patient?: string
    }
    progress?: {
      level?: number
      notes?: string
    }
  }
  userRole?: 'patient' | 'doctor' | 'admin'
  onView?: (id: string) => void
  onAction?: (id: string, action: string) => void
  index?: number
}

const AppointmentCard = ({
  appointment,
  userRole = 'patient',
  onView,
  onAction,
  index = 0
}: AppointmentCardProps) => {
  const appointmentId = appointment._id || appointment.id || ''
  const date = new Date(appointment.appointmentDate)
  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const statusColors = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    'In Progress': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    Completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    Cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    Rescheduled: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
  }

  const typeIcons = {
    'Home Visit': HomeIcon,
    'Online Consultation': VideoCameraIcon,
    'Clinic Visit': MapPinIcon
  }

  const typeColors = {
    'Home Visit': { bg: 'bg-primary-100', icon: 'text-primary-600' },
    'Online Consultation': { bg: 'bg-secondary-100', icon: 'text-secondary-600' },
    'Clinic Visit': { bg: 'bg-accent-100', icon: 'text-accent-600' }
  }

  const status = statusColors[appointment.status] || statusColors.Pending
  const typeColor = typeColors[appointment.type] || typeColors['Home Visit']
  const TypeIcon = typeIcons[appointment.type] || HomeIcon

  const displayName =
    userRole === 'patient'
      ? appointment.doctor?.name || 'Doctor'
      : appointment.patient?.name || 'Patient'

  const displayInfo =
    userRole === 'patient'
      ? appointment.doctor?.specialization || ''
      : appointment.patient?.email || appointment.patient?.phone || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 relative overflow-hidden"
    >
      {/* Book Corner Effect */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-14 h-14 ${typeColor.bg} rounded-xl flex items-center justify-center`}>
              <TypeIcon className={`h-7 w-7 ${typeColor.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-gray-900 font-display mb-1">{displayName}</h3>
              {displayInfo && (
                <p className="text-sm text-gray-600 truncate">{displayInfo}</p>
              )}
              {appointment.service?.name && (
                <p className="text-sm text-primary-600 font-medium mt-1">
                  {appointment.service.name}
                </p>
              )}
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text} ${status.border} border-2 whitespace-nowrap`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarDaysIcon className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <ClockIcon className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium">{appointment.appointmentTime}</span>
          </div>
        </div>

        {appointment.type === 'Home Visit' && appointment.address && (
          <div className="flex items-start space-x-2 text-gray-600 mb-4">
            <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">
              {appointment.address.street}, {appointment.address.city}, {appointment.address.state}
            </span>
          </div>
        )}

        {appointment.progress?.level !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-primary-600">{appointment.progress.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${appointment.progress.level}%` }}
              />
            </div>
          </div>
        )}

        {appointment.notes?.doctor && userRole === 'patient' && (
          <div className="bg-primary-50 rounded-xl p-3 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Doctor's Note: </span>
              {appointment.notes.doctor}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          {onView && (
            <button
              onClick={() => onView(appointmentId)}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors duration-300 font-medium text-sm"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View Details</span>
            </button>
          )}
          {onAction && appointment.status === 'Pending' && userRole === 'doctor' && (
            <>
              <button
                onClick={() => onAction(appointmentId, 'accept')}
                className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors duration-300 font-medium text-sm"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onAction(appointmentId, 'decline')}
                className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-300 font-medium text-sm"
              >
                <XCircleIcon className="h-4 w-4" />
                <span>Decline</span>
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AppointmentCard





