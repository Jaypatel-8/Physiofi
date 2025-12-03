'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/providers'
import { patientAPI, appointmentAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import TreatmentPlan from '@/components/dashboard/TreatmentPlan'
import ProgressTracking from '@/components/dashboard/ProgressTracking'
import toast from 'react-hot-toast'

const PatientTreatment = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadAppointments()
  }, [user, router])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getAppointments({ status: 'all', limit: 50 })
      const appointmentsData = response.data.data?.appointments || response.data.appointments || []
      setAppointments(appointmentsData)
      
      // Select the most recent completed appointment with treatment plan
      const completedWithPlan = appointmentsData
        .filter((apt: any) => apt.status === 'Completed' && apt.treatment)
        .sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
      
      if (completedWithPlan.length > 0) {
        setSelectedAppointment(completedWithPlan[0])
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAppointmentDetails = async (appointmentId: string) => {
    try {
      const response = await appointmentAPI.getAppointment(appointmentId)
      const appointment = response.data.data || response.data
      setSelectedAppointment(appointment)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load appointment details')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading treatment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Treatment Plan & Progress" subtitle="Track your recovery journey" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Treatment Plan */}
            {selectedAppointment && (
              <TreatmentPlan
                plan={selectedAppointment.treatment || {}}
                canEdit={false}
              />
            )}

            {/* Progress Tracking */}
            {selectedAppointment && (
              <ProgressTracking
                currentProgress={selectedAppointment.progress?.level || 0}
                progressLogs={[
                  {
                    date: selectedAppointment.appointmentDate,
                    level: selectedAppointment.progress?.level || 0,
                    notes: selectedAppointment.progress?.notes,
                    improvements: selectedAppointment.progress?.improvements,
                    concerns: selectedAppointment.progress?.concerns
                  }
                ]}
                canEdit={false}
              />
            )}

            {!selectedAppointment && (
              <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-gray-100 text-center">
                <p className="text-gray-600 text-lg">No treatment plan available yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your treatment plan will appear here after your first completed appointment
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Appointment History */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Appointment History</h3>
                <div className="space-y-3">
                  {appointments
                    .filter((apt: any) => apt.status === 'Completed')
                    .map((appointment: any) => (
                      <button
                        key={appointment._id}
                        onClick={() => loadAppointmentDetails(appointment._id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedAppointment?._id === appointment._id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {appointment.doctor?.name || 'Doctor'}
                        </div>
                        {appointment.treatment && (
                          <div className="text-xs text-primary-600 mt-2 font-medium">
                            Treatment plan available
                          </div>
                        )}
                      </button>
                    ))}
                  {appointments.filter((apt: any) => apt.status === 'Completed').length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No completed appointments yet
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientTreatment






