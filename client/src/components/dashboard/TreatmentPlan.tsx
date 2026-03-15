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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="site-card bg-pastel-lavender-50 border-pastel-lavender-200/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Active Treatment Plans</h3>
          <p className="text-sm text-gray-500 mt-0.5">Track your recovery progress</p>
        </div>
        <div className="w-10 h-10 bg-pastel-lavender-100 rounded-xl flex items-center justify-center text-pastel-lavender-600">
          <HeartIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
        {plans.length > 0 ? (
          plans.map((plan, index) => {
            const progress = getProgressPercentage(plan.sessionsCompleted || 0, plan.totalSessions || 1)
            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="site-card p-4 border-primary-200/40"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="site-card-title text-gray-800 mb-1 group-hover:text-pink-700 transition-colors">
                      {plan.condition || plan.title || 'Treatment Plan'}
                    </h4>
                    {plan.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{plan.description}</p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    plan.status === 'Active' ? 'bg-pastel-mint-100 text-pastel-mint-700 border border-pastel-mint-200' :
                    plan.status === 'Completed' ? 'bg-pastel-lavender-100 text-pastel-lavender-700 border border-pastel-lavender-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {plan.status || 'Active'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-primary-600">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-primary-500 rounded-full"
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
