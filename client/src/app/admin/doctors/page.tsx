'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
import toast from 'react-hot-toast'

const AdminDoctorsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [doctors, setDoctors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [doctorToApprove, setDoctorToApprove] = useState<any>(null)
  const [approveMessage, setApproveMessage] = useState('')
  const [messageToDoctor, setMessageToDoctor] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    status: 'Active'
  })

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      loadDoctors()
    }
  }, [user, loading, router])

  const loadDoctors = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getDoctors()
      if (response.data.success) {
        setDoctors(response.data.data.doctors || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading doctors:', error)
      toast.error('Failed to load doctors')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveClick = (doctor: any) => {
    setDoctorToApprove(doctor)
    setApproveMessage('')
    setIsApproveOpen(true)
  }

  const handleApproveConfirm = async () => {
    if (!doctorToApprove) return
    try {
      await adminAPI.approveDoctor(doctorToApprove._id || doctorToApprove.id, true, undefined, approveMessage.trim() || undefined)
      toast.success('Doctor approved. They will be notified in the system.')
      setIsApproveOpen(false)
      setDoctorToApprove(null)
      setApproveMessage('')
      loadDoctors()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update doctor status')
    }
  }

  const handleSendMessageToDoctor = async () => {
    if (!selectedDoctor || !messageToDoctor.trim()) {
      toast.error('Please enter a message')
      return
    }
    try {
      setSendingMessage(true)
      await adminAPI.sendMessageToDoctor(selectedDoctor._id || selectedDoctor.id, messageToDoctor.trim())
      toast.success('Message sent. Doctor will see it in their notifications.')
      setMessageToDoctor('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return

    try {
      await adminAPI.deleteDoctor(id)
      toast.success('Doctor deleted successfully')
      loadDoctors()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    try {
      await adminAPI.updateDoctor(selectedDoctor._id || selectedDoctor.id, formData)
      toast.success('Doctor updated successfully')
      setIsEditOpen(false)
      setSelectedDoctor(null)
      loadDoctors()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update doctor')
    }
  }

  const formatAddress = (address: any): string => {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address
    if (typeof address === 'object') {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.pincode,
        address.country
      ].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : 'N/A'
    }
    return 'N/A'
  }

  const filteredDoctors = doctors.filter(doctor => {
    const search = searchTerm.toLowerCase()
    return (
      (doctor.name || doctor.full_name || '').toLowerCase().includes(search) ||
      (doctor.email || '').toLowerCase().includes(search) ||
      (doctor.phone || '').toLowerCase().includes(search) ||
      (doctor.specialization || []).some((spec: string) => spec.toLowerCase().includes(search))
    )
  })

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Doctor Management" subtitle="Loading..." />
        <div className="site-card p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader
        title="Doctor Management"
        subtitle="Manage all registered doctors"
      />
      {/* Search */}
      <div className="site-card p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name, email, phone, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 text-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="site-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-0.5">Total Doctors</p>
          <p className="text-xl site-card-title">{doctors.length}</p>
        </div>
        <div className="site-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-0.5">Active</p>
          <p className="text-xl site-card-title text-green-600">
            {doctors.filter(d => d.status === 'Active').length}
          </p>
        </div>
        <div className="site-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-0.5">Pending</p>
          <p className="text-xl site-card-title text-amber-600">
            {doctors.filter(d => d.status === 'Inactive' || d.isVerified === false).length}
          </p>
        </div>
        <div className="site-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-0.5">On Leave</p>
          <p className="text-xl site-card-title text-blue-600">
            {doctors.filter(d => d.status === 'On Leave').length}
          </p>
        </div>
      </div>

      {/* Doctors Table */}
      {filteredDoctors.length > 0 ? (
            <div className="site-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Specialization</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDoctors.map((doctor, index) => (
                      <motion.tr
                        key={doctor._id || doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <UserGroupIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {doctor.name || doctor.full_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{doctor.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization]).slice(0, 2).map((spec: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                                {spec}
                              </span>
                            ))}
                            {(Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization]).length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                +{(Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization]).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            doctor.status === 'Active' ? 'bg-green-100 text-green-700' :
                            doctor.status === 'On Leave' ? 'bg-blue-100 text-blue-700' :
                            doctor.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {doctor.status || 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedDoctor(doctor)
                                setIsViewOpen(true)
                              }}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDoctor(doctor)
                                setFormData({
                                  name: doctor.name || doctor.full_name || '',
                                  email: doctor.email || '',
                                  phone: doctor.phone || '',
                                  specialization: Array.isArray(doctor.specialization) ? doctor.specialization.join(', ') : doctor.specialization || '',
                                  status: doctor.status || 'Active'
                                })
                                setIsEditOpen(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            {doctor.status !== 'Active' && (
                              <button
                                onClick={() => handleApproveClick(doctor)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(doctor._id || doctor.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="site-card text-center py-16">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm ? 'Try a different search term' : 'No doctors registered yet'}
              </p>
            </div>
          )}

      {/* View Modal */}
      {isViewOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Doctor Details</h2>
              <button
                onClick={() => {
                  setIsViewOpen(false)
                  setSelectedDoctor(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedDoctor.name || selectedDoctor.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedDoctor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedDoctor.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedDoctor.status === 'Active' ? 'bg-green-100 text-green-700' :
                    selectedDoctor.status === 'On Leave' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedDoctor.status || 'Inactive'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedDoctor.specialization) ? selectedDoctor.specialization : [selectedDoctor.specialization]).map((spec: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Clinic Address</label>
                  <p className="text-gray-900">{formatAddress(selectedDoctor.clinic_address || selectedDoctor.address)}</p>
                </div>
              </div>

              {/* Request from doctor / message to doctor – system notification only */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Request from doctor / Send message</label>
                <p className="text-xs text-gray-500 mb-2">Doctor will be notified in the system only. Use this to request documents or any information.</p>
                <div className="flex gap-2">
                  <textarea
                    value={messageToDoctor}
                    onChange={(e) => setMessageToDoctor(e.target.value)}
                    placeholder="e.g. Please upload your license copy or update your availability..."
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessageToDoctor}
                    disabled={sendingMessage || !messageToDoctor.trim()}
                    className="shrink-0 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? 'Sending...' : 'Send message'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Approve doctor modal – optional message */}
      {isApproveOpen && doctorToApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-black text-gray-900 mb-2">Approve doctor</h2>
            <p className="text-gray-600 text-sm mb-4">
              Approve <strong>{doctorToApprove.name || doctorToApprove.full_name}</strong>? They will be notified in the system.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message to doctor (optional)</label>
              <textarea
                value={approveMessage}
                onChange={(e) => setApproveMessage(e.target.value)}
                placeholder="e.g. Welcome! Please complete your profile."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApproveConfirm}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => { setIsApproveOpen(false); setDoctorToApprove(null); setApproveMessage('') }}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Edit Doctor</h2>
              <button
                onClick={() => {
                  setIsEditOpen(false)
                  setSelectedDoctor(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Comma-separated specializations"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Update Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false)
                    setSelectedDoctor(null)
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  )
}

export default AdminDoctorsPage





