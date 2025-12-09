'use client'

import { motion } from 'framer-motion'
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface NotificationCardProps {
  notification: any
  index: number
}

const NotificationCard = ({ notification, index }: NotificationCardProps) => {
  const getIcon = () => {
    const type = notification.type?.toLowerCase() || 'info'
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-primary-500" />
    }
  }

  const getBgColor = () => {
    const type = notification.type?.toLowerCase() || 'info'
    switch (type) {
      case 'success':
        return 'from-emerald-50 to-emerald-100/50 border-emerald-200'
      case 'warning':
        return 'from-amber-50 to-amber-100/50 border-amber-200'
      case 'error':
        return 'from-red-50 to-red-100/50 border-red-200'
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
          <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
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




