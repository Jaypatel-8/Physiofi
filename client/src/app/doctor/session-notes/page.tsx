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
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const SessionNotesPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [notes, setNotes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    session_date: new Date().toISOString().split('T')[0],
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    treatment_provided: '',
    patient_response: '',
    next_steps: ''
  })
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'doctor') {
        router.replace('/login')
        return
      }
      loadNotes()
      loadAppointments()
    }
  }, [user, loading, router])

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getSessionNotes()
      if (response.data.success) {
        setNotes(response.data.data.notes || [])
      }
    } catch (error) {
      console.error('Error loading session notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments({ status: 'Completed' })
      if (response.data.success) {
        setAppointments(response.data.data.appointments || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.appointmentId || !formData.patientId) {
      toast.error('Please select an appointment')
      return
    }

    try {
      await doctorAPI.createSessionNote(formData)
      toast.success('Session note created successfully!')
      setIsCreateOpen(false)
      setFormData({
        appointmentId: '',
        patientId: '',
        session_date: new Date().toISOString().split('T')[0],
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        treatment_provided: '',
        patient_response: '',
        next_steps: ''
      })
      loadNotes()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create session note')
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
          <p className="text-gray-600">Loading session notes...</p>
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
                <h1 className="text-4xl font-black mb-2">Session Notes</h1>
                <p className="text-white/90">Create and manage patient session notes</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Note
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {notes.length > 0 ? (
            <div className="space-y-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note._id || note.id}
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
                        <h3 className="text-xl font-black text-gray-900 mb-1">Session Note</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {note.patient?.name || note.patient?.full_name || 'Patient'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(note.session_date || note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {note.subjective && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Subjective</h4>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{note.subjective}</p>
                      </div>
                    )}

                    {note.objective && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Objective</h4>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{note.objective}</p>
                      </div>
                    )}

                    {note.assessment && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Assessment</h4>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{note.assessment}</p>
                      </div>
                    )}

                    {note.plan && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Plan</h4>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{note.plan}</p>
                      </div>
                    )}
                  </div>

                  {note.treatment_provided && (
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-900 mb-2">Treatment Provided</h4>
                      <p className="text-gray-700 bg-primary-50 rounded-lg p-4">{note.treatment_provided}</p>
                    </div>
                  )}

                  {note.patient_response && (
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-900 mb-2">Patient Response</h4>
                      <p className="text-gray-700 bg-secondary-50 rounded-lg p-4">{note.patient_response}</p>
                    </div>
                  )}

                  {note.next_steps && (
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-900 mb-2">Next Steps</h4>
                      <p className="text-gray-700 bg-tertiary-50 rounded-lg p-4">{note.next_steps}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Session Notes</h3>
              <p className="text-gray-600 mb-6">Create your first session note after an appointment</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Create Session Note</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment *</label>
                <select
                  value={formData.appointmentId}
                  onChange={(e) => {
                    const apt = appointments.find(a => a._id === e.target.value || a.id === e.target.value)
                    setFormData({
                      ...formData,
                      appointmentId: e.target.value,
                      patientId: apt?.patient?._id || apt?.patient?.id || apt?.patientId || ''
                    })
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Appointment</option>
                  {appointments.map(apt => (
                    <option key={apt._id || apt.id} value={apt._id || apt.id}>
                      {new Date(apt.appointmentDate).toLocaleDateString()} - {apt.patient?.name || apt.patient?.full_name || 'Patient'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Date *</label>
                <input
                  type="date"
                  value={formData.session_date}
                  onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subjective</label>
                  <textarea
                    value={formData.subjective}
                    onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                    rows={4}
                    placeholder="Patient's chief complaint and history"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Objective</label>
                  <textarea
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    rows={4}
                    placeholder="Observations, measurements, tests"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assessment</label>
                  <textarea
                    value={formData.assessment}
                    onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                    rows={4}
                    placeholder="Diagnosis and problem list"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan</label>
                  <textarea
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    rows={4}
                    placeholder="Treatment plan, goals, recommendations"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Provided</label>
                <textarea
                  value={formData.treatment_provided}
                  onChange={(e) => setFormData({ ...formData, treatment_provided: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Response</label>
                <textarea
                  value={formData.patient_response}
                  onChange={(e) => setFormData({ ...formData, patient_response: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Next Steps</label>
                <textarea
                  value={formData.next_steps}
                  onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Create Note
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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

export default SessionNotesPage




