'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const SessionNotesPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [notes, setNotes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadNotes()
    }
  }, [user, loading, router])

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getSessionNotes()
      if (response.data.success) {
        setNotes(response.data.data.notes || [])
      }
    } catch (error) {
      console.error('Error loading session notes:', error)
    } finally {
      setIsLoading(false)
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
            <Link href="/patient/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black mb-2">Session Notes</h1>
              <LockClosedIcon className="h-6 w-6 text-white/80" />
            </div>
            <p className="text-white/90">View your doctor's session notes (Read Only)</p>
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
                            {note.doctor?.name || note.doctor?.full_name || 'Doctor'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(note.session_date || note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                      <LockClosedIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600">Read Only</span>
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
                      <h4 className="font-bold text-gray-900 mb-2">Your Response</h4>
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
              <p className="text-gray-600">Your doctor's session notes will appear here after appointments</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SessionNotesPage





