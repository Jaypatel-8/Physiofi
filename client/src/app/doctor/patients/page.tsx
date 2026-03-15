'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserGroupIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'

const DoctorPatients = () => {
  const { user, loading } = useAuth()
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadPatients()
    }
  }, [user, loading])

  const loadPatients = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getPatients({ limit: 50 })
      if (response.data.success) {
        setPatients(response.data.data.patients || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="My Patients" subtitle="Loading..." />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader title="My Patients" subtitle="View and manage your patient list" />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        {patients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient: any) => (
              <Link
                key={patient._id || patient.id}
                href={`/doctor/patients/${patient._id || patient.id}`}
                className="block p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{patient.name || 'Patient'}</h3>
                    <p className="text-sm text-gray-600">{patient.email || patient.phone || 'No contact'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No patients found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorPatients
