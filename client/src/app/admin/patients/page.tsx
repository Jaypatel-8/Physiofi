'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const AdminPatients = () => {
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
      const response = await adminAPI.getPatients({ limit: 100 })
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black mb-2">Manage Patients</h1>
          <p className="text-white/90">View and manage all registered patients</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient: any) => (
                <Link
                  key={patient._id || patient.id}
                  href={`/admin/patients/${patient._id || patient.id}`}
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
              <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No patients found</p>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminPatients

