'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function PatientTreatmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { user, loading } = useAuth()
  const [plan, setPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      if (user.role !== 'patient') {
        window.location.href = '/'
        return
      }
      if (id) loadPlan()
    }
  }, [user, loading, id])

  const loadPlan = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await patientAPI.getTreatmentPlan(id)
      if (response.data.success && response.data.data) {
        setPlan(response.data.data.treatmentPlan || response.data.data)
      } else {
        setError('Treatment plan not found.')
      }
    } catch {
      setError('Unable to load treatment plan.')
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
          <p className="text-gray-600">Loading treatment plan...</p>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 container-custom py-12">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Treatment plan not found</h1>
            <p className="text-gray-600 mb-6">{error || 'This plan may have been removed or you don\'t have access.'}</p>
            <Link
              href="/patient/treatment"
              className="inline-flex items-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Treatment Plans
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const statusClass =
    plan.status === 'Active'
      ? 'bg-green-100 text-green-700'
      : plan.status === 'Completed'
      ? 'bg-primary-100 text-primary-700'
      : plan.status === 'Paused'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-100 text-gray-700'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHeader user={user} />
      <div className="pt-16 lg:pt-20">
        <div className="container-custom py-8">
          <Link
            href="/patient/treatment"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Treatment Plans
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{plan.condition}</h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                    {plan.status}
                  </span>
                </div>
                {plan.doctor && (
                  <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{plan.doctor.name}</p>
                      {plan.doctor.specialization?.[0] && (
                        <p className="text-sm text-gray-600">{plan.doctor.specialization[0]}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {plan.treatmentPlan && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-primary-600" />
                    Treatment Plan
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.treatmentPlan}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {plan.duration && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">{plan.duration}</span>
                  </div>
                )}
                {plan.sessions > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">
                      {plan.completedSessions ?? 0} / {plan.sessions} sessions
                    </span>
                  </div>
                )}
                {plan.price > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CurrencyDollarIcon className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">₹{plan.price}</span>
                  </div>
                )}
                {plan.startDate && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">
                      Started {new Date(plan.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {plan.progress > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-primary-600">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/patient/exercise-plans"
                className="inline-flex items-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                <AcademicCapIcon className="h-5 w-5" />
                View Exercise Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
