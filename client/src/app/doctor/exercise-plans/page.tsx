'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const ExercisePlansPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    condition: '',
    plan_name: '',
    exercises: [{ name: '', description: '', repetitions: '', sets: '', duration: '', frequency: '', instructions: '' }],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'Active'
  })
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'doctor') {
        router.replace('/login')
        return
      }
      loadPlans()
      loadPatients()
    }
  }, [user, loading, router])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getExercisePlans()
      if (response.data.success) {
        setPlans(response.data.data.plans || [])
      }
    } catch (error) {
      console.error('Error loading exercise plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      const response = await doctorAPI.getPatients()
      if (response.data.success) {
        setPatients(response.data.data.patients || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId || !formData.condition || !formData.plan_name || formData.exercises.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await doctorAPI.createExercisePlan(formData)
      toast.success('Exercise plan created successfully!')
      setIsCreateOpen(false)
      resetForm()
      loadPlans()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create exercise plan')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    try {
      await doctorAPI.updateExercisePlan(selectedPlan._id || selectedPlan.id, formData)
      toast.success('Exercise plan updated successfully!')
      setIsEditOpen(false)
      setSelectedPlan(null)
      resetForm()
      loadPlans()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update exercise plan')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise plan?')) return

    try {
      await doctorAPI.deleteExercisePlan(id)
      toast.success('Exercise plan deleted successfully!')
      loadPlans()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete exercise plan')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      condition: '',
      plan_name: '',
      exercises: [{ name: '', description: '', repetitions: '', sets: '', duration: '', frequency: '', instructions: '' }],
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      status: 'Active'
    })
  }

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', description: '', repetitions: '', sets: '', duration: '', frequency: '', instructions: '' }]
    })
  }

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    })
  }

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...formData.exercises]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, exercises: updated })
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
            <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black mb-2">Exercise Plans</h1>
                <p className="text-white/90">Create and manage patient exercise plans</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Plan
              </button>
            </div>
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
                            {plan.patient?.name || plan.patient?.full_name || 'Patient'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            Started {new Date(plan.start_date || plan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                        plan.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPlan(plan)
                          setFormData({
                            patientId: plan.patient?._id || plan.patient?.id || '',
                            appointmentId: plan.appointment?._id || plan.appointment?.id || '',
                            condition: plan.condition || '',
                            plan_name: plan.plan_name || '',
                            exercises: plan.exercises || [{ name: '', description: '', repetitions: '', sets: '', duration: '', frequency: '', instructions: '' }],
                            start_date: plan.start_date ? new Date(plan.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            end_date: plan.end_date ? new Date(plan.end_date).toISOString().split('T')[0] : '',
                            status: plan.status || 'Active'
                          })
                          setIsEditOpen(true)
                        }}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id || plan.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Condition</h4>
                    <p className="text-gray-700">{plan.condition}</p>
                  </div>

                  {plan.exercises && plan.exercises.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-3">Exercises</h4>
                      <div className="space-y-3">
                        {plan.exercises.map((exercise: any, idx: number) => (
                          <div key={idx} className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                            <h5 className="font-bold text-gray-900 mb-2">{exercise.name}</h5>
                            {exercise.description && (
                              <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                              {exercise.repetitions && (
                                <div><span className="font-semibold">Reps:</span> {exercise.repetitions}</div>
                              )}
                              {exercise.sets && (
                                <div><span className="font-semibold">Sets:</span> {exercise.sets}</div>
                              )}
                              {exercise.duration && (
                                <div><span className="font-semibold">Duration:</span> {exercise.duration}</div>
                              )}
                              <div><span className="font-semibold">Frequency:</span> {exercise.frequency}</div>
                            </div>
                            {exercise.instructions && (
                              <p className="text-sm text-gray-600 mt-2">{exercise.instructions}</p>
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
              <p className="text-gray-600 mb-6">Create your first exercise plan for a patient</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {isEditOpen ? 'Edit Exercise Plan' : 'Create Exercise Plan'}
              </h2>
              <button
                onClick={() => {
                  setIsCreateOpen(false)
                  setIsEditOpen(false)
                  setSelectedPlan(null)
                  resetForm()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Patient *</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id || patient.id} value={patient._id || patient.id}>
                        {patient.name || patient.full_name} - {patient.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    value={formData.plan_name}
                    onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Exercises *</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    + Add Exercise
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Exercise {index + 1}</h4>
                        {formData.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                          <textarea
                            value={exercise.description}
                            onChange={(e) => updateExercise(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Repetitions</label>
                          <input
                            type="number"
                            value={exercise.repetitions}
                            onChange={(e) => updateExercise(index, 'repetitions', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (minutes)</label>
                          <input
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => updateExercise(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Frequency *</label>
                          <input
                            type="text"
                            value={exercise.frequency}
                            onChange={(e) => updateExercise(index, 'frequency', e.target.value)}
                            placeholder="e.g., Daily, 3 times a week"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Instructions</label>
                          <textarea
                            value={exercise.instructions}
                            onChange={(e) => updateExercise(index, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  {isEditOpen ? 'Update' : 'Create'} Plan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setIsEditOpen(false)
                    setSelectedPlan(null)
                    resetForm()
                  }}
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




