'use client'

import { motion } from 'framer-motion'
import { HeartIcon, CalendarDaysIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface TreatmentPlanProps {
  plans: any[]
}

const TreatmentPlan = ({ plans }: TreatmentPlanProps) => {
  const getProgressPercentage = (completed: number, total: number) => {
    if (!total || total === 0) return 0
    return Math.round((completed / total) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-50/90 to-pink-100/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-pink-200/60"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-800 mb-2 bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
            Active Treatment Plans
          </h3>
          <p className="text-sm text-gray-700">Track your recovery progress</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl flex items-center justify-center shadow-sm">
          <HeartIcon className="h-6 w-6 text-pink-700" />
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {plans.length > 0 ? (
          plans.map((plan, index) => {
            const progress = getProgressPercentage(plan.sessionsCompleted || 0, plan.totalSessions || 1)
            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-5 bg-white/80 rounded-2xl border-2 border-pink-200/50 hover:border-pink-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors">
                      {plan.condition || plan.title || 'Treatment Plan'}
                    </h4>
                    {plan.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{plan.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    plan.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    plan.status === 'Completed' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {plan.status || 'Active'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold text-pink-700">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      {plan.sessionsCompleted || 0} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-3 w-3" />
                      {plan.totalSessions || 0} total
                    </span>
                  </div>
                </div>
                
                {plan.duration && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDaysIcon className="h-3 w-3" />
                    Duration: {plan.duration}
                  </p>
                )}
              </motion.div>
            )
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="h-10 w-10 text-pink-700" />
            </div>
            <p className="text-gray-700 mb-2 font-medium">No active treatment plans</p>
            <p className="text-sm text-gray-600">Your treatment plans will appear here</p>
          </motion.div>
        )}
      </div>
      {plans.length > 0 && (
        <Link
          href="/patient/exercise-plans"
          className="mt-6 flex items-center justify-center gap-2 text-pink-700 hover:text-pink-800 font-semibold text-sm group"
        >
          View All Plans
          <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  )
}

export default TreatmentPlan
