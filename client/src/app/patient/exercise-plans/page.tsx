'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const ExercisePlansPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [progressData, setProgressData] = useState({
    exercise_name: '',
    repetitions_completed: '',
    sets_completed: '',
    notes: ''
  })

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadPlans()
    }
  }, [user, loading, router])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getExercisePlans()
      if (response.data.success) {
        setPlans(response.data.data.plans || [])
      }
    } catch (error) {
      console.error('Error loading exercise plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProgress = async (planId: string) => {
    try {
      await patientAPI.updateExerciseProgress(planId, {
        exercise_name: progressData.exercise_name,
        repetitions_completed: parseInt(progressData.repetitions_completed) || 0,
        sets_completed: parseInt(progressData.sets_completed) || 0,
        notes: progressData.notes
      })
      toast.success('Progress updated successfully!')
      setSelectedPlan(null)
      setProgressData({
        exercise_name: '',
        repetitions_completed: '',
        sets_completed: '',
        notes: ''
      })
      loadPlans()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update progress')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading exercise plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12">
          <div className="container-custom">
            <Link href="/patient/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-black mb-2">Exercise Plans</h1>
            <p className="text-white/90">View and track your assigned exercise plans</p>
          </div>
        </div>

        <div className="container-custom py-8">
          {plans.length > 0 ? (
            <div className="space-y-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan._id || plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <ClipboardDocumentCheckIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{plan.plan_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {plan.doctor?.name || plan.doctor?.full_name || 'Doctor'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            Started {new Date(plan.start_date || plan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                      plan.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Condition</h4>
                    <p className="text-gray-700">{plan.condition}</p>
                  </div>

                  {plan.exercises && plan.exercises.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-3">Exercises</h4>
                      <div className="space-y-3">
                        {plan.exercises.map((exercise: any, idx: number) => {
                          const progress = plan.progress?.filter((p: any) => p.exercise_name === exercise.name) || []
                          const totalCompleted = progress.length
                          
                          return (
                            <div key={idx} className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-bold text-gray-900">{exercise.name}</h5>
                                {totalCompleted > 0 && (
                                  <div className="flex items-center gap-1 text-sm text-green-600">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Completed {totalCompleted} times
                                  </div>
                                )}
                              </div>
                              {exercise.description && (
                                <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700 mb-2">
                                {exercise.repetitions && (
                                  <div>
                                    <span className="font-semibold">Reps:</span> {exercise.repetitions}
                                  </div>
                                )}
                                {exercise.sets && (
                                  <div>
                                    <span className="font-semibold">Sets:</span> {exercise.sets}
                                  </div>
                                )}
                                {exercise.duration && (
                                  <div>
                                    <span className="font-semibold">Duration:</span> {exercise.duration} min
                                  </div>
                                )}
                                <div>
                                  <span className="font-semibold">Frequency:</span> {exercise.frequency}
                                </div>
                              </div>
                              {exercise.instructions && (
                                <p className="text-sm text-gray-600 mb-2">{exercise.instructions}</p>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setProgressData({
                                    exercise_name: exercise.name,
                                    repetitions_completed: exercise.repetitions?.toString() || '',
                                    sets_completed: exercise.sets?.toString() || '',
                                    notes: ''
                                  })
                                }}
                                className="mt-2 text-sm px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                              >
                                Mark as Completed
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {plan.progress && plan.progress.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">Progress History</h4>
                      <div className="space-y-2">
                        {plan.progress.slice(0, 5).map((prog: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>{prog.exercise_name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{new Date(prog.completed_date).toLocaleDateString()}</span>
                            {prog.repetitions_completed > 0 && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{prog.repetitions_completed} reps</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Exercise Plans</h3>
              <p className="text-gray-600">Your doctor will assign exercise plans after appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Update Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-4">Update Progress</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateProgress(selectedPlan._id || selectedPlan.id)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise</label>
                <input
                  type="text"
                  value={progressData.exercise_name}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Repetitions Completed</label>
                  <input
                    type="number"
                    value={progressData.repetitions_completed}
                    onChange={(e) => setProgressData({ ...progressData, repetitions_completed: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sets Completed</label>
                  <input
                    type="number"
                    value={progressData.sets_completed}
                    onChange={(e) => setProgressData({ ...progressData, sets_completed: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={progressData.notes}
                  onChange={(e) => setProgressData({ ...progressData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Update Progress
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ExercisePlansPage





