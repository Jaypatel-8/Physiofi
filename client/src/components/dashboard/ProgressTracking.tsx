'use client'

import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  TrendingUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface ProgressLog {
  date: Date | string
  level: number
  notes?: string
  improvements?: string[]
  concerns?: string[]
}

interface ProgressTrackingProps {
  currentProgress: number
  progressLogs?: ProgressLog[]
  canEdit?: boolean
  onUpdate?: (progress: number) => void
  onAddLog?: () => void
}

const ProgressTracking = ({
  currentProgress,
  progressLogs = [],
  canEdit = false,
  onUpdate,
  onAddLog
}: ProgressTrackingProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-green-600'
    if (progress >= 50) return 'from-primary-400 to-primary-600'
    if (progress >= 25) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getProgressLabel = (progress: number) => {
    if (progress >= 80) return 'Excellent Progress'
    if (progress >= 50) return 'Good Progress'
    if (progress >= 25) return 'Moderate Progress'
    return 'Early Stage'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden">
      {/* Book Corner Effect */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 font-display flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-primary-500" />
            Recovery Progress
          </h3>
          {canEdit && onAddLog && (
            <button
              onClick={onAddLog}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Log
            </button>
          )}
        </div>

        {/* Current Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Overall Progress</p>
              <p className="text-3xl font-black text-gray-900 font-display">{currentProgress}%</p>
              <p className="text-sm text-gray-600 mt-1">{getProgressLabel(currentProgress)}</p>
            </div>
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getProgressColor(currentProgress)} flex items-center justify-center shadow-lg`}>
              <TrendingUpIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(currentProgress)}`}
            />
          </div>
        </div>

        {/* Progress Timeline */}
        {progressLogs.length > 0 ? (
          <div>
            <h4 className="text-lg font-black text-gray-900 mb-4 font-display">Progress Timeline</h4>
            <div className="space-y-4">
              {progressLogs
                .sort((a, b) => {
                  const dateA = new Date(a.date).getTime()
                  const dateB = new Date(b.date).getTime()
                  return dateB - dateA
                })
                .map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 border-l-2 border-primary-200 pb-4 last:pb-0"
                  >
                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full -ml-[9px] border-2 border-white"></div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(log.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getProgressColor(log.level)} text-white`}>
                        {log.level}%
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-gray-700 mb-2">{log.notes}</p>
                    )}
                    {log.improvements && log.improvements.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-green-700 mb-1">Improvements:</p>
                        <ul className="space-y-1">
                          {log.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {log.concerns && log.concerns.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-yellow-700 mb-1">Concerns:</p>
                        <ul className="space-y-1">
                          {log.concerns.map((concern, i) => (
                            <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No progress logs available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressTracking





