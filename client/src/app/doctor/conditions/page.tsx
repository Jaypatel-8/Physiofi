'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
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

const DoctorConditions = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [conditions, setConditions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCondition, setEditingCondition] = useState<any>(null)
  const [formData, setFormData] = useState({
    condition: '',
    conditionSlug: '',
    treatmentPlan: '',
    duration: '',
    sessions: '',
    price: '',
    description: '',
    successRate: ''
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
      loadConditions()
    }
  }, [user, loading])

  const loadConditions = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getConditions()
      if (response.data.success) {
        setConditions(response.data.data.conditions || [])
      }
    } catch (error) {
      console.error('Error loading conditions:', error)
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
      if (editingCondition) {
        const response = await doctorAPI.updateCondition(editingCondition._id, {
          condition: formData.condition,
          conditionSlug: formData.conditionSlug,
          treatmentPlan: formData.treatmentPlan,
          duration: formData.duration,
          sessions: parseInt(formData.sessions) || 0,
          price: parseFloat(formData.price) || 0,
          description: formData.description,
          successRate: parseFloat(formData.successRate) || 0
        })
        if (response.data.success) {
          toast.success('Condition updated successfully')
          setIsModalOpen(false)
          setEditingCondition(null)
          resetForm()
          loadConditions()
        }
      } else {
        const response = await doctorAPI.addCondition({
          condition: formData.condition,
          conditionSlug: formData.conditionSlug,
          treatmentPlan: formData.treatmentPlan,
          duration: formData.duration,
          sessions: parseInt(formData.sessions) || 0,
          price: parseFloat(formData.price) || 0,
          description: formData.description,
          successRate: parseFloat(formData.successRate) || 0
        })
        if (response.data.success) {
          toast.success('Condition added successfully')
          setIsModalOpen(false)
          resetForm()
          loadConditions()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save condition')
    }
  }

  const handleEdit = (condition: any) => {
    setEditingCondition(condition)
    setFormData({
      condition: condition.condition,
      conditionSlug: condition.conditionSlug,
      treatmentPlan: condition.treatmentPlan,
      duration: condition.duration,
      sessions: condition.sessions?.toString() || '',
      price: condition.price?.toString() || '',
      description: condition.description || '',
      successRate: condition.successRate?.toString() || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this condition?')) return
    
    try {
      const response = await doctorAPI.deleteCondition(id)
      if (response.data.success) {
        toast.success('Condition deleted successfully')
        loadConditions()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete condition')
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
      successRate: ''
    })
    setEditingCondition(null)
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Conditions & Treatment Plans" subtitle="Loading..." />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DashboardSubPageHeader title="Conditions & Treatment Plans" subtitle="Manage conditions you treat and your treatment plans" />
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="shrink-0 flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Condition
        </button>
      </div>

      <div>
        {conditions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition) => (
              <motion.div
                key={condition._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-900 flex-1">{condition.condition}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(condition)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(condition._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Treatment Plan</p>
                    <p className="text-gray-600 text-sm">{condition.treatmentPlan}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span className="font-semibold">{condition.duration}</span>
                    </div>
                    {condition.sessions > 0 && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="font-semibold">{condition.sessions} sessions</span>
                      </div>
                    )}
                    {condition.price > 0 && (
                      <div className="flex items-center gap-1 text-primary-600">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span className="font-semibold">₹{condition.price}</span>
                      </div>
                    )}
                  </div>

                  {condition.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{condition.description}</p>
                  )}

                  {condition.successRate > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-semibold text-green-600">{condition.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${condition.successRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-600 text-lg mb-4">No conditions added yet</p>
            <button
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Condition
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="condition-modal-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 id="condition-modal-title" className="text-2xl font-black text-gray-900">
                {editingCondition ? 'Edit Condition' : 'Add Condition'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700 p-2 focus:ring-2 focus:ring-primary-500 rounded-lg"
                aria-label="Close condition form"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              <div>
                <label htmlFor="condition-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  id="condition-select"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition-treatment-plan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment Plan *
                </label>
                <textarea
                  id="condition-treatment-plan"
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  aria-required="true"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your treatment approach for this condition..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="condition-duration" className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    id="condition-duration"
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 4-6 weeks, 3 months"
                  />
                </div>

                <div>
                  <label htmlFor="condition-sessions" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Sessions
                  </label>
                  <input
                    id="condition-sessions"
                    type="number"
                    name="sessions"
                    value={formData.sessions}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label htmlFor="condition-price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    id="condition-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                </div>

                <div>
                  <label htmlFor="condition-success-rate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Success Rate (%)
                  </label>
                  <input
                    id="condition-success-rate"
                    type="number"
                    name="successRate"
                    value={formData.successRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 85"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="condition-description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="condition-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional details about this condition and treatment..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  {editingCondition ? 'Update Condition' : 'Add Condition'}
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
    </>
  )
}

export default DoctorConditions

