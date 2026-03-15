'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MegaphoneIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
import toast from 'react-hot-toast'

export default function AdminBroadcastPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<'all' | 'doctors' | 'patients'>('all')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/admin/login')
      return
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await adminAPI.broadcastNotification({ title: title.trim(), message: message.trim(), audience })
      toast.success(res.data?.message || 'Broadcast sent. Doctors and patients will see it in their dashboard.')
      setTitle('')
      setMessage('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send broadcast')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader
        title="Broadcast message"
        subtitle="Send a notification to doctors and/or patients. They will see it on their dashboard."
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="site-card p-6 max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as 'all' | 'doctors' | 'patients')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            >
              <option value="all">All (doctors + patients)</option>
              <option value="doctors">Doctors only</option>
              <option value="patients">Patients only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clinic holiday notice"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message. Doctors and patients will see this in their notifications."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !message.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MegaphoneIcon className="h-5 w-5" />
            {submitting ? 'Sending...' : 'Send to dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
