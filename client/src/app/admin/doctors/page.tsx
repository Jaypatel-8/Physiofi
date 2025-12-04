'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, UserGroupIcon, UserCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const AdminDoctors = () => {
  const { user, loading } = useAuth()
  const [doctors, setDoctors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadDoctors()
    }
  }, [user, loading])

  const loadDoctors = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getDoctors({ limit: 100 })
      if (response.data.success) {
        setDoctors(response.data.data.doctors || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading doctors:', error)
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
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-12">
        <div className="container-custom">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black mb-2">Manage Doctors</h1>
          <p className="text-white/90">View and manage all registered doctors</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor: any) => (
                <Link
                  key={doctor._id || doctor.id}
                  href={`/admin/doctors/${doctor._id || doctor.id}`}
                  className="block p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCircleIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Dr. {doctor.name || 'Doctor'}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization?.[0] || 'Physiotherapist'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      doctor.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {doctor.status || 'Active'}
                    </span>
                    <span className="text-sm text-gray-500">{doctor.email || ''}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No doctors found</p>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDoctors

