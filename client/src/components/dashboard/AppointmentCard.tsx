'use client'

import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon, HomeIcon, VideoCameraIcon } from '@heroicons/react/24/outline'

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
  const rawType = (serviceType || appointment.type || '').toLowerCase()
  const isHomeVisit = rawType.includes('home')
  const isTele = rawType.includes('online') || rawType.includes('tele') || rawType.includes('consultation')
  const displayType = isHomeVisit ? 'Home Visit' : isTele ? 'Tele Consultation' : (appointment.type || serviceType || 'Appointment')
  const addressStr = formatAddress(appointment.address)
  const doctorObj = appointment.doctor
  const doctorName = typeof doctorObj === 'object' && doctorObj
    ? (doctorObj.name || (doctorObj as any).full_name)
    : (appointment.doctorName || appointment.doctor)
  const doctorDisplay = typeof doctorName === 'string' ? doctorName : String((doctorName as any)?.name ?? (doctorName as any)?.full_name ?? '')

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onView?.(); } }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onView}
      className="group relative overflow-hidden site-card bg-primary-50/50 border-primary-200/40 rounded-xl p-4 sm:p-5 cursor-pointer no-underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Service type badge */}
            <div className="flex items-center gap-2 mb-2">
              {isHomeVisit ? (
                <HomeIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
              ) : (
                <VideoCameraIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
              )}
              <span className="text-sm font-bold text-primary-700 no-underline">
                {displayType}
              </span>
            </div>
            
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDaysIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <ClockIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
              </div>

              {showDoctor && doctorDisplay && (
                <div className="flex items-center gap-2 text-gray-700 pt-0.5">
                  <UserIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="font-medium">Dr. {doctorDisplay}</span>
                </div>
              )}

              {isHomeVisit && addressStr && (
                <div className="flex items-start gap-2 text-gray-600 pt-0.5">
                  <MapPinIcon className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-xs sm:text-sm">{addressStr}</span>
                </div>
              )}

              {Array.isArray(appointment.symptoms) && appointment.symptoms.length > 0 && (
                <p className="text-xs text-gray-500 pt-0.5 no-underline">
                  Symptoms: {appointment.symptoms.slice(0, 2).join(', ')}{appointment.symptoms.length > 2 ? '…' : ''}
                </p>
              )}
            </div>
          </div>
          
          {appointment.status && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${getStatusColor(appointment.status)}`}
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
