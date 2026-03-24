'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

const PatientTreatment = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'Active' | 'Completed' | 'Paused'>('all')

  const loadTreatmentPlans = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await patientAPI.getTreatmentPlans(params)
      if (response.data.success) {
        setTreatmentPlans(response.data.data.treatmentPlans || [])
      }
    } catch (error) {
      console.error('Error loading treatment plans:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

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
      // Only load if user is authenticated
      if (user && user.role === 'patient') {
        loadTreatmentPlans()
      }
    }
  }, [user, loading, loadTreatmentPlans])

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
          <p className="text-gray-600">Loading treatment plans...</p>
        </div>
      </div>
    )
  }

  const filteredPlans = filter === 'all' 
    ? treatmentPlans 
    : treatmentPlans.filter(tp => tp.status === filter)

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHeader user={user} />
      <div className="pt-16 lg:pt-20">
      <div className="container-custom py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white rounded-lg shadow-md inline-flex">
          {(['all', 'Active', 'Completed', 'Paused'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                filter === status
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status === 'all' ? 'All Plans' : status}
            </button>
          ))}
        </div>

        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => router.push(`/patient/treatment/${plan._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{plan.condition}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                        plan.status === 'Completed' ? 'bg-primary-100 text-primary-700' :
                        plan.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>
                  {plan.doctor && (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{plan.treatmentPlan}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-semibold">{plan.duration}</span>
                  </div>
                  {plan.sessions > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="font-semibold">
                        {plan.completedSessions || 0} / {plan.sessions} sessions completed
                      </span>
                    </div>
                  )}
                  {plan.price > 0 && (
                    <div className="flex items-center gap-2 text-sm text-primary-600">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span className="font-semibold">₹{plan.price}</span>
                    </div>
                  )}
                </div>

                {plan.progress > 0 && (
                  <div className="mb-4">
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

                {plan.doctor && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Doctor</p>
                    <p className="text-sm font-semibold text-gray-900">{plan.doctor.name}</p>
                    {plan.doctor.specialization && plan.doctor.specialization.length > 0 && (
                      <p className="text-xs text-gray-500">{plan.doctor.specialization[0]}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              {filter === 'all' 
                ? 'No treatment plans yet' 
                : `No ${filter.toLowerCase()} treatment plans`}
            </p>
            <p className="text-sm text-gray-500">
              {filter === 'all' 
                ? 'Your doctor will create treatment plans for you after consultations'
                : 'Try selecting a different filter'}
            </p>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default PatientTreatment
