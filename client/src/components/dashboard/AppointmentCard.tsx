'use client'

import { motion } from 'framer-motion'

interface AppointmentCardProps {
  appointment: any
  onView?: () => void
  onEdit?: () => void
}

const AppointmentCard = ({ appointment, onView, onEdit }: AppointmentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{appointment.type || 'Appointment'}</h3>
          <p className="text-sm text-gray-600">{appointment.appointmentDate}</p>
          <p className="text-sm text-gray-600">{appointment.appointmentTime}</p>
        </div>
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AppointmentCard
