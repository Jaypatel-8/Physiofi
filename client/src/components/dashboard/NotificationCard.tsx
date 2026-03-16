'use client'

import { motion } from 'framer-motion'
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface NotificationCardProps {
  notification: any
  index: number
}

const NotificationCard = ({ notification, index }: NotificationCardProps) => {
  // Approved/success = green; by nature (type) for others
  const getIcon = () => {
    const type = notification.type?.toLowerCase() || 'info'
    const isApproved = (notification as any).status === 'approved' || (notification as any).data?.status === 'approved'
    if (isApproved) return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
    switch (type) {
      case 'success':
      case 'doctor_approval':
      case 'appointment_confirmed':
      case 'reschedule_accepted':
      case 'treatment_update':
      case 'progress_update':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
      case 'appointment_cancelled':
      case 'reschedule_declined':
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
      case 'admin_message_to_doctor':
      case 'payment_reminder':
      case 'appointment_request':
      case 'appointment_reminder':
      case 'appointment_status_change':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
      case 'admin_announcement':
      case 'system_announcement':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-primary-500" />
    }
  }

  const getBgColor = () => {
    const type = notification.type?.toLowerCase() || 'info'
    const isApproved = (notification as any).status === 'approved' || (notification as any).data?.status === 'approved'
    if (isApproved) return 'from-emerald-50 to-emerald-100/50 border-emerald-200'
    switch (type) {
      case 'success':
      case 'doctor_approval':
      case 'appointment_confirmed':
      case 'reschedule_accepted':
      case 'treatment_update':
      case 'progress_update':
        return 'from-emerald-50 to-emerald-100/50 border-emerald-200'
      case 'appointment_cancelled':
      case 'reschedule_declined':
      case 'error':
        return 'from-red-50 to-red-100/50 border-red-200'
      case 'warning':
      case 'admin_message_to_doctor':
      case 'payment_reminder':
      case 'appointment_request':
      case 'appointment_reminder':
      case 'appointment_status_change':
        return 'from-amber-50 to-amber-100/50 border-amber-200'
      case 'admin_announcement':
      case 'system_announcement':
        return 'from-blue-50 to-blue-100/50 border-blue-200'
      default:
        return 'from-primary-50 to-primary-100/50 border-primary-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`p-4 bg-gradient-to-r ${getBgColor()} rounded-xl border hover:shadow-md transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm site-card-title mb-1 group-hover:text-primary-700 transition-colors">
            {notification.title || 'Notification'}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {notification.message || notification.description || 'No description'}
          </p>
          {notification.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default NotificationCard





