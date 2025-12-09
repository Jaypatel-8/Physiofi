'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  DocumentTextIcon,
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

const PrescriptionsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    diagnosis: '',
    notes: '',
    follow_up_date: '',
    follow_up_required: false
  })
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'doctor') {
        router.replace('/login')
        return
      }
      loadPrescriptions()
      loadPatients()
    }
  }, [user, loading, router])

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getPrescriptions()
      if (response.data.success) {
        setPrescriptions(response.data.data.prescriptions || [])
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
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
    if (!formData.patientId || !formData.diagnosis || formData.medications.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await doctorAPI.createPrescription(formData)
      toast.success('Prescription created successfully!')
      setIsCreateOpen(false)
      resetForm()
      loadPrescriptions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create prescription')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPrescription) return

    try {
      await doctorAPI.updatePrescription(selectedPrescription._id || selectedPrescription.id, formData)
      toast.success('Prescription updated successfully!')
      setIsEditOpen(false)
      setSelectedPrescription(null)
      resetForm()
      loadPrescriptions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update prescription')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return

    try {
      await doctorAPI.deletePrescription(id)
      toast.success('Prescription deleted successfully!')
      loadPrescriptions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete prescription')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      diagnosis: '',
      notes: '',
      follow_up_date: '',
      follow_up_required: false
    })
  }

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    })
  }

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    })
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...formData.medications]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, medications: updated })
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
          <p className="text-gray-600">Loading prescriptions...</p>
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
                <h1 className="text-4xl font-black mb-2">Prescriptions</h1>
                <p className="text-white/90">Create and manage patient prescriptions</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Prescription
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {prescriptions.length > 0 ? (
            <div className="space-y-6">
              {prescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription._id || prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">Prescription</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {prescription.patient?.name || prescription.patient?.full_name || 'Patient'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(prescription.issued_at || prescription.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPrescription(prescription)
                          setFormData({
                            patientId: prescription.patient?._id || prescription.patient?.id || '',
                            appointmentId: prescription.appointment?._id || prescription.appointment?.id || '',
                            medications: prescription.medications || [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
                            diagnosis: prescription.diagnosis || '',
                            notes: prescription.notes || '',
                            follow_up_date: prescription.follow_up_date ? new Date(prescription.follow_up_date).toISOString().split('T')[0] : '',
                            follow_up_required: prescription.follow_up_required || false
                          })
                          setIsEditOpen(true)
                        }}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prescription._id || prescription.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Diagnosis</h4>
                    <p className="text-gray-700">{prescription.diagnosis}</p>
                  </div>

                  {prescription.medications && prescription.medications.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-3">Medications</h4>
                      <div className="space-y-3">
                        {prescription.medications.map((med: any, idx: number) => (
                          <div key={idx} className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-bold text-gray-900">{med.name}</h5>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                              <div><span className="font-semibold">Dosage:</span> {med.dosage}</div>
                              <div><span className="font-semibold">Frequency:</span> {med.frequency}</div>
                              <div><span className="font-semibold">Duration:</span> {med.duration}</div>
                            </div>
                            {med.instructions && (
                              <p className="text-sm text-gray-600 mt-2">{med.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {prescription.notes && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-700">{prescription.notes}</p>
                    </div>
                  )}

                  {prescription.follow_up_required && prescription.follow_up_date && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-yellow-800">
                        Follow-up required on {new Date(prescription.follow_up_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Prescriptions</h3>
              <p className="text-gray-600 mb-6">Create your first prescription for a patient</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Prescription
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
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {isEditOpen ? 'Edit Prescription' : 'Create Prescription'}
              </h2>
              <button
                onClick={() => {
                  setIsCreateOpen(false)
                  setIsEditOpen(false)
                  setSelectedPrescription(null)
                  resetForm()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleUpdate : handleCreate} className="space-y-4">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Medications *</label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    + Add Medication
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.medications.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Medication {index + 1}</h4>
                        {formData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Dosage *</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Frequency *</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Duration *</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Instructions</label>
                          <textarea
                            value={med.instructions}
                            onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.follow_up_required}
                    onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Follow-up Required</span>
                </label>
                {formData.follow_up_required && (
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  {isEditOpen ? 'Update' : 'Create'} Prescription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setIsEditOpen(false)
                    setSelectedPrescription(null)
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

export default PrescriptionsPage



