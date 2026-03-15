'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
import toast from 'react-hot-toast'

const AdminPatientDetail = () => {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  const { user, loading } = useAuth()
  const [patient, setPatient] = useState<any>(null)
  const [sessionNotes, setSessionNotes] = useState<any[]>([])
  const [exercisePlans, setExercisePlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      loadPatient()
    }
  }, [user, loading, patientId, router])

  const loadPatient = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getPatient(patientId)
      if (response.data.success) {
        setPatient(response.data.data)
        await loadPatientSessionNotesAndPlans(patientId)
      } else {
        toast.error('Patient not found')
        router.push('/admin/patients')
      }
    } catch (error: any) {
      console.error('Error loading patient:', error)
      toast.error(error.response?.data?.message || 'Failed to load patient')
      router.push('/admin/patients')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPatientSessionNotesAndPlans = async (pid: string) => {
    try {
      const [notesRes, plansRes] = await Promise.all([
        adminAPI.getSessionNotes({ patientId: pid }).catch(() => ({ data: { success: false, data: { notes: [] } } })),
        adminAPI.getExercisePlans({ patientId: pid }).catch(() => ({ data: { success: false, data: { plans: [] } } }))
      ])
      if (notesRes.data.success && notesRes.data.data?.notes) {
        setSessionNotes(notesRes.data.data.notes)
      }
      if (plansRes.data.success && plansRes.data.data?.plans) {
        setExercisePlans(plansRes.data.data.plans)
      }
    } catch (e) {
      console.error('Error loading session notes/exercise plans:', e)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Patient Details" subtitle="Loading..." />
        <div className="site-card p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <>
    <div className="space-y-6">
      <Link href="/admin/patients" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Patients
      </Link>
      <DashboardSubPageHeader
        title="Patient Details"
        subtitle={patient.name || patient.full_name || 'Complete patient information'}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="site-card p-6"
          >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-14 w-14 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{patient.name || 'Patient'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{patient.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Age</p>
                      <p className="font-semibold text-gray-900">{patient.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="font-semibold text-gray-900">{patient.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            {patient.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Address</h3>
                <p className="text-gray-600">
                  {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.pincode}
                </p>
              </motion.div>
            )}

            {/* Emergency Contact */}
            {patient.emergencyContact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Relation</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.relation || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical History */}
            {patient.medicalHistory?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-3">
                  {patient.medicalHistory.map((history: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-gray-900 mb-1">{history.condition || 'Condition'}</p>
                      {history.diagnosis && <p className="text-sm text-gray-600 mb-1">Diagnosis: {history.diagnosis}</p>}
                      {history.treatment && <p className="text-sm text-gray-600">Treatment: {history.treatment}</p>}
                      {history.date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Date: {new Date(history.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Session Notes / Treatment (trackable) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="site-card p-6"
            >
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                Recent Session Notes &amp; Treatment
              </h3>
              <p className="text-sm text-gray-600 mb-4">Session notes written for this patient by their doctor(s). Treatment and plan data are trackable over time.</p>
              {sessionNotes.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {sessionNotes.slice(0, 10).map((note: any) => (
                    <div key={note._id || note.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{new Date(note.session_date || note.createdAt).toLocaleDateString()}</span>
                        {note.doctor?.name && <span>Dr. {note.doctor.name}</span>}
                      </div>
                      {note.treatment_provided && (
                        <p className="text-gray-800 font-medium mb-1">Treatment: {note.treatment_provided}</p>
                      )}
                      {note.plan && <p className="text-gray-700 text-sm">Plan: {note.plan}</p>}
                      {note.assessment && <p className="text-gray-600 text-sm">Assessment: {note.assessment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No session notes yet for this patient.</p>
              )}
            </motion.div>

            {/* Active Exercise Plans (trackable) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="site-card p-6"
            >
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-primary-600" />
                Active Exercise Plans
              </h3>
              <p className="text-sm text-gray-600 mb-4">Current exercise plans assigned to this patient. Trackable and visible to patient.</p>
              {exercisePlans.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {exercisePlans.map((plan: any) => (
                    <div key={plan._id || plan.id} className="p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{plan.plan_name || 'Exercise Plan'}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                          plan.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {plan.status || 'Active'}
                        </span>
                      </div>
                      {plan.condition && <p className="text-sm text-gray-700 mb-1">Condition: {plan.condition}</p>}
                      <p className="text-xs text-gray-500">
                        Started {new Date(plan.start_date || plan.createdAt).toLocaleDateString()}
                        {plan.end_date && ` – End ${new Date(plan.end_date).toLocaleDateString()}`}
                      </p>
                      {plan.doctor?.name && <p className="text-xs text-gray-500 mt-1">By Dr. {plan.doctor.name}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No exercise plans assigned yet.</p>
              )}
            </motion.div>

            {/* Current Conditions */}
            {patient.currentConditions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="site-card p-6"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Current Conditions</h3>
                <div className="space-y-3">
                  {patient.currentConditions.map((condition: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{condition.condition || 'Condition'}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          condition.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                          condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {condition.severity || 'Mild'}
                        </span>
                      </div>
                      {condition.notes && <p className="text-sm text-gray-600">{condition.notes}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="site-card p-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-bold text-gray-900">{patient.totalAppointments || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recovery Progress</span>
                  <span className="font-bold text-gray-900">{patient.recoveryProgress || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {patient.status || 'Active'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="site-card p-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/patients/${patientId}/appointments`}
                  className="block w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  View Appointments
                </Link>
                <Link
                  href="/admin/patients"
                  className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Patients
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPatientDetail

