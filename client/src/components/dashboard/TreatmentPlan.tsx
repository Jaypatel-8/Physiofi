'use client'

import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Exercise {
  name: string
  description: string
  repetitions: number
  sets: number
  frequency: string
  duration: number
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface TreatmentPlanProps {
  plan: {
    plan?: string
    exercises?: Exercise[]
    medications?: Medication[]
    recommendations?: string[]
  }
  canEdit?: boolean
  onEdit?: () => void
}

const TreatmentPlan = ({ plan, canEdit = false, onEdit }: TreatmentPlanProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden">
      {/* Book Corner Effect */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 font-display flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-500" />
            Treatment Plan
          </h3>
          {canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium text-sm flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Plan
            </button>
          )}
        </div>

        {/* Treatment Plan Overview */}
        {plan.plan && (
          <div className="mb-6 p-4 bg-primary-50 rounded-xl border-2 border-primary-100">
            <p className="text-gray-700 leading-relaxed">{plan.plan}</p>
          </div>
        )}

        {/* Exercises Section */}
        {plan.exercises && plan.exercises.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-black text-gray-900 mb-4 font-display">Exercises</h4>
            <div className="space-y-4">
              {plan.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">{exercise.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2 text-primary-500" />
                          <span>{exercise.duration} min</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium">Sets: {exercise.sets}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium">Reps: {exercise.repetitions}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-primary-500" />
                          <span>{exercise.frequency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Medications Section */}
        {plan.medications && plan.medications.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-black text-gray-900 mb-4 font-display">Medications</h4>
            <div className="space-y-4">
              {plan.medications.map((medication, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">{medication.name}</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-2">
                        <div className="text-gray-600">
                          <span className="font-medium">Dosage: </span>
                          {medication.dosage}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Frequency: </span>
                          {medication.frequency}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Duration: </span>
                          {medication.duration}
                        </div>
                      </div>
                      {medication.instructions && (
                        <p className="text-sm text-gray-600 italic mt-2">
                          {medication.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {plan.recommendations && plan.recommendations.length > 0 && (
          <div>
            <h4 className="text-lg font-black text-gray-900 mb-4 font-display">Recommendations</h4>
            <ul className="space-y-2">
              {plan.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl"
                >
                  <CheckCircleIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {!plan.plan && (!plan.exercises || plan.exercises.length === 0) && 
         (!plan.medications || plan.medications.length === 0) && 
         (!plan.recommendations || plan.recommendations.length === 0) && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No treatment plan available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreatmentPlan






