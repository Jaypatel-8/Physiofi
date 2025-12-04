'use client'

import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AppointmentCardProps {
  appointment: any
  onView?: () => void
  onEdit?: () => void
  showPatient?: boolean
  showDoctor?: boolean
}

const AppointmentCard = ({ appointment, onView, onEdit, showPatient = false, showDoctor = false }: AppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'confirmed':
        return 'bg-primary-100 text-primary-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{appointment.type || 'Appointment'}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
              {appointment.status || 'Pending'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDaysIcon className="h-4 w-4 text-primary-500" />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 text-primary-500" />
              <span>{appointment.appointmentTime || 'Time TBD'}</span>
            </div>
            {appointment.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 text-primary-500" />
                <span>{appointment.address.street}, {appointment.address.city}</span>
              </div>
            )}
            {showPatient && appointment.patient && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4 text-primary-500" />
                <span>{appointment.patient.name || 'Patient'}</span>
              </div>
            )}
            {showDoctor && appointment.doctor && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4 text-primary-500" />
                <span>Dr. {appointment.doctor.name || 'Doctor'}</span>
              </div>
            )}
          </div>

          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
              <p className="text-sm text-gray-700">{appointment.symptoms.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            View Details
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default AppointmentCard
