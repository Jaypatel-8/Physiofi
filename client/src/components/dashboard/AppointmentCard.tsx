'use client'

import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline'

interface AppointmentCardProps {
  appointment: any
  onView?: () => void
  showPatient?: boolean
  showDoctor?: boolean
}

const AppointmentCard = ({ appointment, onView, showDoctor = true }: AppointmentCardProps) => {
  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return 'N/A'
    return time
  }

  const formatAddress = (addr: any) => {
    if (!addr) return null
    const parts = [addr.street, addr.landmark, addr.city, addr.state, addr.pincode].filter(Boolean)
    return parts.length ? parts.join(', ') : null
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

  const serviceType = appointment.serviceType || appointment.type
  const addressStr = formatAddress(appointment.address)
  const doctorObj = appointment.doctor
  const doctorName = typeof doctorObj === 'object' && doctorObj
    ? (doctorObj.name || (doctorObj as any).full_name)
    : (appointment.doctorName || appointment.doctor)
  const isHomeVisit = (serviceType || appointment.type || '').toLowerCase().includes('home')

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
          <div className="flex-1 min-w-0">
            <h4 className="site-card-title text-lg mb-2 group-hover:text-primary-700 transition-colors">
              {appointment.type || serviceType || 'Appointment'}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDaysIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ClockIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
              </div>
              
              {(serviceType || appointment.type) && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <HomeIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium capitalize">{serviceType || appointment.type}</span>
                </div>
              )}

              {showDoctor && doctorName && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <UserIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="font-medium">Dr. {typeof doctorName === 'string' ? doctorName : String((doctorName as any)?.name ?? (doctorName as any)?.full_name ?? '')}</span>
                </div>
              )}

              {isHomeVisit && addressStr && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPinIcon className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{addressStr}</span>
                </div>
              )}

              {Array.isArray(appointment.symptoms) && appointment.symptoms.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Symptoms: {appointment.symptoms.slice(0, 2).join(', ')}{appointment.symptoms.length > 2 ? '…' : ''}
                </p>
              )}
            </div>
          </div>
          
          {appointment.status && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 flex-shrink-0 ${getStatusColor(appointment.status)} shadow-sm`}
            >
              {appointment.status}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AppointmentCard
