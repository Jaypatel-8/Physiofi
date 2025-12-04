'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface ProgressTrackingProps {
  progress: any
}

const ProgressTracking = ({ progress }: ProgressTrackingProps) => {
  const progressData = progress || {
    painLevel: { current: 3, previous: 5, improvement: 40 },
    mobility: { current: 7, previous: 5, improvement: 40 },
    strength: { current: 6, previous: 4, improvement: 50 }
  }

  const metrics = [
    { name: 'Pain Level', current: progressData.painLevel?.current || 0, previous: progressData.painLevel?.previous || 0, improvement: progressData.painLevel?.improvement || 0, reverse: true },
    { name: 'Mobility', current: progressData.mobility?.current || 0, previous: progressData.mobility?.previous || 0, improvement: progressData.mobility?.improvement || 0 },
    { name: 'Strength', current: progressData.strength?.current || 0, previous: progressData.strength?.previous || 0, improvement: progressData.strength?.improvement || 0 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-900">Progress Tracking</h3>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
          <ArrowTrendingUpIcon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              <span className={`text-sm font-semibold ${
                metric.improvement > 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.current / 10) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`h-3 rounded-full ${
                  metric.reverse 
                    ? metric.current <= 3 ? 'bg-green-500' : metric.current <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    : metric.current >= 7 ? 'bg-green-500' : metric.current >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span>Previous: {metric.previous}/10</span>
              <span>Current: {metric.current}/10</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ProgressTracking
