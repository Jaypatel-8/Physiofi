'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
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
      <div className="space-y-6">
        <DashboardSubPageHeader title="Session Notes" subtitle="Loading..." />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <DashboardSubPageHeader title="Session Notes" subtitle="Create and manage patient session notes" />
        <button
          onClick={() => setIsCreateOpen(true)}
          className="shrink-0 flex items-center gap-2 bg-primary-50 border border-primary-200/50 text-primary-700 hover:bg-primary-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Create Note
        </button>
      </div>

      <div className="flex-1 min-h-0 mt-6">
          {notes.length > 0 ? (
            <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2 pb-4 custom-scrollbar">
              {notes.map((note, index) => (
                <motion.div
                  key={note._id || note.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow max-w-4xl"
                >
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 shrink-0 bg-primary-50 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-0.5 truncate">Session Note</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {note.patient?.name || note.patient?.full_name || 'Patient'}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(note.session_date || note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {note.subjective && (
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Subjective</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100 line-clamp-3">{note.subjective}</p>
                      </div>
                    )}

                    {note.objective && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Objective</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">{note.objective}</p>
                      </div>
                    )}

                    {note.assessment && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Assessment</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">{note.assessment}</p>
                      </div>
                    )}

                    {note.plan && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Plan</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">{note.plan}</p>
                      </div>
                    )}
                  </div>

                  {note.treatment_provided && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Treatment Provided</h4>
                      <p className="text-gray-700 text-sm bg-primary-50/50 rounded-lg p-3 border border-primary-100">{note.treatment_provided}</p>
                    </div>
                  )}

                  {note.patient_response && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Patient Response</h4>
                      <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">{note.patient_response}</p>
                    </div>
                  )}

                  {note.next_steps && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Next Steps</h4>
                      <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">{note.next_steps}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Session Notes</h3>
              <p className="text-gray-500 text-sm mb-5 max-w-sm">Create your first session note after an appointment</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200/50 text-primary-700 hover:bg-primary-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Note
              </button>
            </div>
          )}
      </div>
      </div>

      {/* Create Modal - Accessible session note form */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-note-modal-title"
          aria-describedby="session-note-modal-desc"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto min-h-full py-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full my-auto max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200 shrink-0">
              <div>
                <h2 id="session-note-modal-title" className="text-lg font-bold text-gray-900">Create Session Note</h2>
                <p id="session-note-modal-desc" className="text-sm text-gray-600 mt-0.5">SOAP format: Subjective, Objective, Assessment, Plan</p>
                {formData.appointmentId && (() => {
                  const apt = appointments.find(a => (a._id || a.id) === formData.appointmentId)
                  const name = apt?.patient?.name || apt?.patient?.full_name || 'Patient'
                  return <p className="text-xs text-primary-600 font-medium mt-1">For patient: {name}</p>
                })()}
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Close create session note form"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col flex-1 min-h-0" noValidate>
            <div className="p-4 overflow-y-auto flex-1 space-y-5">
              <section aria-labelledby="session-note-appointment-heading" className="space-y-4">
                <h3 id="session-note-appointment-heading" className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">Appointment &amp; Date</h3>
                <div>
                  <label htmlFor="session-note-appointment" className="block text-sm font-semibold text-gray-700 mb-2">Appointment *</label>
                  <select
                    id="session-note-appointment"
                    value={formData.appointmentId}
                    onChange={(e) => {
                      const apt = appointments.find(a => a._id === e.target.value || a.id === e.target.value)
                      setFormData({
                        ...formData,
                        appointmentId: e.target.value,
                        patientId: apt?.patient?._id || apt?.patient?.id || apt?.patientId || ''
                      })
                    }}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                    required
                    aria-required="true"
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
                  <label htmlFor="session-note-date" className="block text-sm font-semibold text-gray-700 mb-2">Session Date *</label>
                  <input
                    id="session-note-date"
                    type="date"
                    value={formData.session_date}
                    onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                    required
                    aria-required="true"
                  />
                </div>
              </section>

              <section aria-labelledby="session-note-soap-heading" className="space-y-4">
                <h3 id="session-note-soap-heading" className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">SOAP Notes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="session-note-subjective" className="block text-sm font-semibold text-gray-700 mb-2">Subjective</label>
                    <textarea
                      id="session-note-subjective"
                      value={formData.subjective}
                      onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                      rows={3}
                      placeholder="Patient's chief complaint and history"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                      aria-describedby="session-note-subjective-desc"
                    />
                    <span id="session-note-subjective-desc" className="sr-only">Patient&apos;s reported symptoms and history</span>
                  </div>
                  <div>
                    <label htmlFor="session-note-objective" className="block text-sm font-semibold text-gray-700 mb-2">Objective</label>
                    <textarea
                      id="session-note-objective"
                      value={formData.objective}
                      onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                      rows={3}
                      placeholder="Observations, measurements, tests"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                      aria-describedby="session-note-objective-desc"
                    />
                    <span id="session-note-objective-desc" className="sr-only">Clinical findings and measurements</span>
                  </div>
                  <div>
                    <label htmlFor="session-note-assessment" className="block text-sm font-semibold text-gray-700 mb-2">Assessment</label>
                    <textarea
                      id="session-note-assessment"
                      value={formData.assessment}
                      onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                      rows={3}
                      placeholder="Diagnosis and problem list"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="session-note-plan" className="block text-sm font-semibold text-gray-700 mb-2">Plan</label>
                    <textarea
                      id="session-note-plan"
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      rows={3}
                      placeholder="Treatment plan, goals, recommendations"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                    />
                  </div>
                </div>
              </section>

              <section aria-labelledby="session-note-treatment-heading" className="space-y-4">
                <h3 id="session-note-treatment-heading" className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">Treatment &amp; Follow-up</h3>
                <div>
                  <label htmlFor="session-note-treatment-provided" className="block text-sm font-semibold text-gray-700 mb-2">Treatment Provided</label>
                  <textarea
                    id="session-note-treatment-provided"
                    value={formData.treatment_provided}
                    onChange={(e) => setFormData({ ...formData, treatment_provided: e.target.value })}
                    rows={2}
                    placeholder="What was done in this session"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label htmlFor="session-note-patient-response" className="block text-sm font-semibold text-gray-700 mb-2">Patient Response</label>
                  <textarea
                    id="session-note-patient-response"
                    value={formData.patient_response}
                    onChange={(e) => setFormData({ ...formData, patient_response: e.target.value })}
                    rows={2}
                    placeholder="How the patient responded to treatment"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label htmlFor="session-note-next-steps" className="block text-sm font-semibold text-gray-700 mb-2">Next Steps</label>
                  <textarea
                    id="session-note-next-steps"
                    value={formData.next_steps}
                    onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
                    rows={2}
                    placeholder="Follow-up actions or home exercises"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                  />
                </div>
              </section>
            </div>

              <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50/80 shrink-0 rounded-b-xl">
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Create Note
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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

export default SessionNotesPage





