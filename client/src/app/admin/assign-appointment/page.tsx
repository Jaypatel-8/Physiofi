'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'
import toast from 'react-hot-toast'

const APPT_TYPES = ['Home Visit', 'Online Consultation', 'Clinic Visit']

export default function AdminAssignAppointmentPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Clinic Visit' as string,
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/admin/login')
      return
    }
    loadData()
  }, [user, loading, router])

  const loadData = async () => {
    try {
      setLoadingData(true)
      const [pRes, dRes] = await Promise.all([
        adminAPI.getPatients({ limit: 500 }).catch(() => ({ data: { success: false } })),
        adminAPI.getDoctors({ limit: 500 }).catch(() => ({ data: { success: false } })),
      ])
      if (pRes.data.success) setPatients(pRes.data.data.patients || pRes.data.data || [])
      if (dRes.data.success) setDoctors((dRes.data.data.doctors || dRes.data.data || []).filter((d: any) => (d.status || 'Active') === 'Active'))
    } catch (e) {
      toast.error('Failed to load patients/doctors')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (!form.doctorId || !form.date || !form.type) {
      setSlots([])
      return
    }
    let cancelled = false
    setLoadingSlots(true)
    adminAPI
      .getDoctorAvailabilitySlots(form.doctorId, form.date, form.type)
      .then((res) => {
        if (!cancelled && res.data.success) setSlots(res.data.data.availableSlots || [])
      })
      .catch(() => {
        if (!cancelled) setSlots([])
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })
    return () => { cancelled = true }
  }, [form.doctorId, form.date, form.type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.doctorId || !form.date || !form.time || !form.type) {
      toast.error('Please fill all fields')
      return
    }
    setSubmitting(true)
    try {
      await adminAPI.assignAppointment({
        patientId: form.patientId,
        doctorId: form.doctorId,
        appointmentDate: form.date,
        appointmentTime: form.time,
        type: form.type,
      })
      toast.success('Appointment assigned successfully')
      setForm({ patientId: '', doctorId: '', date: '', time: '', type: 'Clinic Visit' })
      setSlots([])
      router.push('/admin/appointments')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign appointment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="Assign Appointment" subtitle="Loading..." />
        <div className="site-card p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
      <DashboardSubPageHeader
        title="Assign Patient to Doctor"
        subtitle="Create an appointment based on doctor availability"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="site-card p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              required
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name || p.full_name} {p.email ? `(${p.email})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              value={form.doctorId}
              onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value, time: '' }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  Dr. {d.name || d.full_name} {d.specialization?.[0] ? `– ${d.specialization[0]}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, time: '' }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            >
              {APPT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: '' }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time (from doctor availability)</label>
            {loadingSlots ? (
              <p className="text-sm text-gray-500">Loading slots...</p>
            ) : slots.length === 0 && form.doctorId && form.date ? (
              <p className="text-sm text-amber-600">No available slots for this date/type. Choose another date or doctor.</p>
            ) : (
              <select
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                required
              >
                <option value="">Select time</option>
                {slots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !form.patientId || !form.doctorId || !form.date || !form.time}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlusIcon className="h-5 w-5" />
              {submitting ? 'Assigning...' : 'Assign Appointment'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/appointments')}
              className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
    </>
  )
}
