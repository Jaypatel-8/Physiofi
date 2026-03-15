'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardPageWrapper from '@/components/dashboard/DashboardPageWrapper'
import toast from 'react-hot-toast'

const MedicalRecordsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    record_type: 'Lab Report',
    title: '',
    description: '',
    file_url: '',
    file_name: ''
  })

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadRecords()
    }
  }, [user, loading, router])

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getMedicalRecords()
      if (response.data.success) {
        setRecords(response.data.data.records || [])
      }
    } catch (error) {
      console.error('Error loading medical records:', error)
      toast.error('Failed to load medical records')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await patientAPI.uploadMedicalRecord(uploadData)
      if (response.data.success) {
        toast.success('Medical record uploaded successfully!')
        setIsUploadOpen(false)
        setUploadData({
          record_type: 'Lab Report',
          title: '',
          description: '',
          file_url: '',
          file_name: ''
        })
        loadRecords()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload record')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center py-24 bg-pastel-mesh">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div><div></div><div></div><div></div>
          </div>
          <p className="text-gray-600">Loading medical records...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardPageWrapper
        title="Medical Records"
        subtitle="View and manage your medical records"
        action={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-sm"
          >
            <DocumentArrowUpIcon className="h-5 w-5" />
            Upload Record
          </button>
        }
      >
        {records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record, index) => (
              <motion.div
                key={record._id || record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-primary-50 rounded-2xl border border-primary-200/50 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                      <DocumentTextIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{record.title}</h3>
                      <p className="text-sm text-gray-500">{record.record_type}</p>
                    </div>
                  </div>
                </div>
                {record.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{record.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(record.uploaded_at || record.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {record.uploaded_by}
                  </div>
                </div>
                <a
                  href={record.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-sm"
                >
                  View Record
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-primary-200/50 bg-primary-50/50">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
              <DocumentTextIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Medical Records</h3>
            <p className="text-gray-600 mb-6">Upload your first medical record to get started</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              Upload Record
            </button>
          </div>
        )}
      </DashboardPageWrapper>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border border-primary-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Medical Record</h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Record Type *</label>
                <select
                  value={uploadData.record_type}
                  onChange={(e) => setUploadData({ ...uploadData, record_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">File URL *</label>
                <input
                  type="url"
                  value={uploadData.file_url}
                  onChange={(e) => setUploadData({ ...uploadData, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">File Name *</label>
                <input
                  type="text"
                  value={uploadData.file_name}
                  onChange={(e) => setUploadData({ ...uploadData, file_name: e.target.value })}
                  placeholder="document.pdf"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
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

export default MedicalRecordsPage
