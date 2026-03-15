'use client'

import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon, TrophyIcon } from '@heroicons/react/24/outline'

interface ProgressTrackingProps {
  progress: number | null
}

const ProgressTracking = ({ progress }: ProgressTrackingProps) => {
  const progressValue = progress || 0
  const getProgressColor = () => {
    if (progressValue >= 80) return 'from-emerald-500 to-emerald-600'
    if (progressValue >= 50) return 'from-primary-500 to-primary-600'
    if (progressValue >= 25) return 'from-amber-500 to-amber-600'
    return 'from-gray-400 to-gray-500'
  }

  const getProgressMessage = () => {
    if (progressValue >= 80) return "Excellent progress! You're almost there!"
    if (progressValue >= 50) return "Great work! Keep up the momentum!"
    if (progressValue >= 25) return "Good start! Every step counts!"
    return "Getting started! You've got this!"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-pastel-mint-50 rounded-2xl border border-pastel-mint-200/50 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recovery Progress</h3>
          <p className="text-sm text-gray-500 mt-0.5">Your overall recovery journey</p>
        </div>
        <div className="w-10 h-10 bg-pastel-mint-100 rounded-xl flex items-center justify-center text-pastel-mint-600">
          <ChartBarIcon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Main Progress Circle */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - progressValue / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black text-gray-800"
              >
                {progressValue}%
              </motion.div>
              <div className="text-xs text-gray-600 mt-1">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
            <span className="text-sm font-bold text-green-700">{progressValue}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full shadow-sm`}
            />
          </div>
        </div>

        {/* Motivational Message */}
        <div className="pt-4 border-t border-green-200/50">
          <div className="flex items-start gap-3 p-4 bg-white/80 rounded-xl border-2 border-green-200/50">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Keep Going!</p>
              <p className="text-xs text-gray-700 leading-relaxed">
                {getProgressMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          {[25, 50, 100].map((milestone) => (
            <div
              key={milestone}
              className={`text-center p-3 rounded-xl border-2 transition-all ${
                progressValue >= milestone
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <TrophyIcon
                className={`h-5 w-5 mx-auto mb-1 ${
                  progressValue >= milestone ? 'text-emerald-600' : 'text-gray-400'
                }`}
              />
              <div className={`text-xs font-bold ${
                progressValue >= milestone ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {milestone}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ProgressTracking
