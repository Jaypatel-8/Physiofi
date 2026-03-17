'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardPageWrapper from '@/components/dashboard/DashboardPageWrapper'

const PrescriptionsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadPrescriptions()
    }
  }, [user, loading, router])

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getPrescriptions()
      if (response.data.success) {
        setPrescriptions(response.data.data.prescriptions || [])
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center py-24 bg-pastel-mesh">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div><div></div><div></div><div></div>
          </div>
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardPageWrapper
      title="My Prescriptions"
      subtitle="View all your prescriptions from doctors"
    >
      {prescriptions.length > 0 ? (
        <div className="space-y-6">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription._id || prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-primary-50 rounded-2xl border border-primary-200/50 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    <DocumentTextIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Prescription</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {prescription.doctor?.name || prescription.doctor?.full_name || 'Doctor'}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(prescription.issued_at || prescription.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
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
                      <div key={idx} className="bg-white rounded-xl p-4 border border-primary-200/50">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-bold text-gray-900">{med.name}</h5>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            {med.duration}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div><span className="font-semibold">Dosage:</span> {med.dosage}</div>
                          <div><span className="font-semibold">Frequency:</span> {med.frequency}</div>
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
                <div className="bg-pastel-peach-50 border border-pastel-peach-200/50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Follow-up required on {new Date(prescription.follow_up_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 sm:py-14 lg:py-16 rounded-2xl border border-primary-200/50 bg-primary-50/50">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
            <DocumentTextIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Prescriptions</h3>
          <p className="text-gray-600">Your prescriptions will appear here after appointments</p>
        </div>
      )}
    </DashboardPageWrapper>
  )
}

export default PrescriptionsPage
