'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface TreatmentPlanProps {
  plans: any[]
}

const TreatmentPlan = ({ plans }: TreatmentPlanProps) => {
  if (!plans || plans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <h3 className="text-xl font-black text-gray-900 mb-4">Treatment Plans</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <p className="text-gray-600 font-medium">No active treatment plans</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <h3 className="text-xl font-black text-gray-900 mb-6">Active Treatment Plans</h3>
      <div className="space-y-4">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-900 mb-2">{plan.condition || plan.title || 'Treatment Plan'}</h4>
                <p className="text-sm text-gray-600 mb-3">{plan.description || 'Ongoing treatment'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ClockIcon className="h-4 w-4 text-primary-500" />
                    <span className="font-semibold">Duration: {plan.duration || 'Ongoing'}</span>
                  </span>
                  {plan.therapist && (
                    <span className="flex items-center gap-2 text-gray-700">
                      <AcademicCapIcon className="h-4 w-4 text-primary-500" />
                      <span className="font-semibold">{plan.therapist}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-gray-700">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">{plan.sessionsCompleted || 0} / {plan.totalSessions || 'N/A'} sessions</span>
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  plan.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {plan.status || 'Active'}
                </span>
              </div>
            </div>
            {plan.totalSessions && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((plan.sessionsCompleted || 0) / plan.totalSessions) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((plan.sessionsCompleted || 0) / plan.totalSessions) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TreatmentPlan
