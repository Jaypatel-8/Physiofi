'use client'

import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface AppointmentCardProps {
  appointment: any
  onView?: () => void
}

const AppointmentCard = ({ appointment, onView }: AppointmentCardProps) => {
  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return 'N/A'
    return time
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'pending':
      case 'scheduled':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onView}
      className="group relative overflow-hidden site-card bg-primary-50/50 border-primary-200/40 rounded-xl p-5 cursor-pointer"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="site-card-title text-lg mb-2 group-hover:text-primary-700 transition-colors">
              {appointment.type || 'Appointment'}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDaysIcon className="h-4 w-4 text-primary-600" />
                <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ClockIcon className="h-4 w-4 text-primary-600" />
                <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
              </div>
              
              {appointment.serviceType && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPinIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium capitalize">{appointment.serviceType}</span>
                </div>
              )}
            </div>
          </div>
          
          {appointment.status && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getStatusColor(appointment.status)} shadow-sm`}
            >
              {appointment.status}
            </motion.span>
          )}
        </div>
        
        {/* Bottom Border Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </motion.div>
  )
}

export default AppointmentCard
