'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  UserCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const CONDITIONS = [
  'Low Back Pain / Sciatica',
  'Neck Pain / Cervical Spondylosis',
  'Shoulder Pain',
  'Knee Pain',
  'Sports Injuries',
  'Post-Operative Rehabilitation',
  'Stroke Rehabilitation',
  "Parkinson's Disease",
  'Spinal Cord Injury',
  'COPD / Asthma / Breathing Issues',
  'Post-COVID Recovery',
  'Pediatric Physiotherapy',
  'Torticollis (Children)',
  'Balance Problems (Geriatric)',
  'Osteoporosis',
  'Pregnancy-Related Pain',
  'Urinary Incontinence'
]

const PatientDetail = () => {
  const router = useRouter()
  const params = useParams()
  const patientId = params.patientId as string
  const { user, loading } = useAuth()
  const [patient, setPatient] = useState<any>(null)
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    condition: '',
    conditionSlug: '',
    treatmentPlan: '',
    duration: '',
    sessions: '',
    price: '',
    description: '',
    exercises: [] as any[],
    medications: [] as any[]
  })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      if (user.role !== 'doctor') {
        window.location.href = '/'
        return
      }
      loadPatient()
    }
  }, [user, loading, patientId])

  const loadPatient = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getPatient(patientId)
      if (response.data.success) {
        setPatient(response.data.data.patient || response.data.data)
        setTreatmentPlans(response.data.data.treatmentPlans || [])
        setAppointments(response.data.data.appointments || [])
      }
    } catch (error) {
      console.error('Error loading patient:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'condition') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, conditionSlug: slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.condition || !formData.treatmentPlan || !formData.duration) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      if (editingPlan) {
        const response = await doctorAPI.updatePatientTreatmentPlan(editingPlan._id, {
          condition: formData.condition,
          conditionSlug: formData.conditionSlug,
          treatmentPlan: formData.treatmentPlan,
          duration: formData.duration,
          sessions: parseInt(formData.sessions) || 0,
          price: parseFloat(formData.price) || 0,
          description: formData.description,
          exercises: formData.exercises,
          medications: formData.medications
        })
        if (response.data.success) {
          toast.success('Treatment plan updated successfully')
          setIsModalOpen(false)
          setEditingPlan(null)
          resetForm()
          loadPatient()
        }
      } else {
        const response = await doctorAPI.createPatientTreatmentPlan(patientId, {
          condition: formData.condition,
          conditionSlug: formData.conditionSlug,
          treatmentPlan: formData.treatmentPlan,
          duration: formData.duration,
          sessions: parseInt(formData.sessions) || 0,
          price: parseFloat(formData.price) || 0,
          description: formData.description,
          exercises: formData.exercises,
          medications: formData.medications
        })
        if (response.data.success) {
          toast.success('Treatment plan created successfully')
          setIsModalOpen(false)
          resetForm()
          loadPatient()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save treatment plan')
    }
  }

  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
    setFormData({
      condition: plan.condition,
      conditionSlug: plan.conditionSlug,
      treatmentPlan: plan.treatmentPlan,
      duration: plan.duration,
      sessions: plan.sessions?.toString() || '',
      price: plan.price?.toString() || '',
      description: plan.description || '',
      exercises: plan.exercises || [],
      medications: plan.medications || []
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment plan?')) return
    
    try {
      const response = await doctorAPI.deletePatientTreatmentPlan(id)
      if (response.data.success) {
        toast.success('Treatment plan deleted successfully')
        loadPatient()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete treatment plan')
    }
  }

  const resetForm = () => {
    setFormData({
      condition: '',
      conditionSlug: '',
      treatmentPlan: '',
      duration: '',
      sessions: '',
      price: '',
      description: '',
      exercises: [],
      medications: []
    })
    setEditingPlan(null)
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
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/doctor/patients" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Patients</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Patient Details</h1>
              <p className="text-white/90">{patient?.name || 'Patient'}</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Treatment Plan
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4">
                  <UserCircleIcon className="h-14 w-14 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{patient?.name || 'Patient'}</h2>
                <p className="text-gray-600 text-sm">{patient?.email || patient?.phone || 'No contact info'}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{patient?.age || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{patient?.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-sm">{patient?.address || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Total Appointments</span>
                  <span className="text-lg font-black text-primary-600">{appointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Active Plans</span>
                  <span className="text-lg font-black text-green-600">
                    {treatmentPlans.filter(tp => tp.status === 'Active').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Treatment Plans */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">Treatment Plans</h2>
              
              {treatmentPlans.length > 0 ? (
                <div className="space-y-4">
                  {treatmentPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-gray-900 mb-1">{plan.condition}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                              plan.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                              plan.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {plan.status}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {plan.duration}
                            </span>
                            {plan.sessions > 0 && (
                              <span className="flex items-center gap-1">
                                <CheckCircleIcon className="h-4 w-4" />
                                {plan.completedSessions || 0}/{plan.sessions} sessions
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{plan.treatmentPlan}</p>
                      
                      {plan.description && (
                        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      )}

                      {plan.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-primary-600">{plan.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {plan.startDate && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Started: {new Date(plan.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No treatment plans yet</p>
                  <button
                    onClick={() => {
                      resetForm()
                      setIsModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create First Treatment Plan
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">
                {editingPlan ? 'Edit Treatment Plan' : 'Create Treatment Plan'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment Plan *
                </label>
                <textarea
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the treatment approach for this patient..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 4-6 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Sessions
                  </label>
                  <input
                    type="number"
                    name="sessions"
                    value={formData.sessions}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional details about this treatment plan..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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

export default PatientDetail
