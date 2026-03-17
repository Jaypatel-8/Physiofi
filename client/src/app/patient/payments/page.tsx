'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet']

const PaymentsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0
  })
  const [payModal, setPayModal] = useState<{ open: boolean; appointment: any }>({ open: false, appointment: null })
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('UPI')
  const [payTxnId, setPayTxnId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadData()
    }
  }, [user, loading, router])

  const loadData = async () => {
    await Promise.all([loadPayments(), loadAppointments()])
  }

  const loadAppointments = async () => {
    try {
      const res = await patientAPI.getAppointments()
      if (res.data.success) {
        const list = res.data.data.appointments || res.data.data || []
        setAppointments(list)
      }
    } catch (e) {
      console.error('Load appointments error:', e)
    }
  }

  const loadPayments = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getMyPayments()
      if (response.data.success) {
        const paymentsData = response.data.data.payments || []
        setPayments(paymentsData)
        
        // Calculate stats
        const total = paymentsData.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        const paid = paymentsData.filter((p: any) => p.payment_status === 'Paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        const pending = paymentsData.filter((p: any) => p.payment_status === 'Pending').reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        
        setStats({ total, paid, pending })
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'Pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'Failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Failed':
        return 'bg-red-100 text-red-700'
      case 'Refunded':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const unpaidAppointments = appointments.filter(
    (a: any) => a.status !== 'Cancelled' && (a.payment?.status || 'Pending') !== 'Paid'
  )

  const openPayModal = (appointment: any) => {
    const amt = appointment.payment?.amount ?? appointment.service?.price ?? 0
    setPayModal({ open: true, appointment })
    setPayAmount(String(amt))
    setPayMethod('UPI')
    setPayTxnId('')
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payModal.appointment || !payAmount || Number(payAmount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setSubmitting(true)
    try {
      await patientAPI.recordPaymentForAppointment({
        appointmentId: payModal.appointment._id || payModal.appointment.id,
        amount: Number(payAmount),
        payment_method: payMethod,
        transaction_id: payTxnId.trim() || undefined
      })
      toast.success('Payment recorded successfully')
      setPayModal({ open: false, appointment: null })
      loadData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record payment')
    } finally {
      setSubmitting(false)
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
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12">
          <div className="container-custom">
            <Link href="/patient/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-black mb-2">Payment History</h1>
            <p className="text-white/90">View all your payment transactions</p>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                  <p className="text-2xl font-black text-gray-900">₹{stats.total.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paid</p>
                  <p className="text-2xl font-black text-gray-900">₹{stats.paid.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-black text-gray-900">₹{stats.pending.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pay for appointment */}
          {unpaidAppointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">Pay for appointment</h2>
              <p className="text-sm text-gray-600 mb-4">You have unpaid appointments. Record your payment below.</p>
              <div className="space-y-3">
                {unpaidAppointments.map((apt: any) => (
                  <div
                    key={apt._id || apt.id}
                    className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 border border-amber-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime} – {apt.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dr. {apt.doctor?.name || 'Doctor'} • ₹{apt.payment?.amount ?? apt.service?.price ?? 0}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPayModal(apt)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600"
                    >
                      Pay now
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payments List */}
          {payments.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment._id || payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            {new Date(payment.createdAt || payment.paid_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-900">₹{payment.amount?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{payment.payment_method}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.payment_status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_status)}`}>
                              {payment.payment_status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 font-mono">
                            {payment.transaction_id || 'N/A'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 sm:py-14 lg:py-16">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CurrencyDollarIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Payments</h3>
              <p className="text-gray-600">Your payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Pay modal */}
      {payModal.open && payModal.appointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Record payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Appointment: {new Date(payModal.appointment.appointmentDate).toLocaleDateString()} at {payModal.appointment.appointmentTime}
            </p>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (optional)</label>
                <input
                  type="text"
                  value={payTxnId}
                  onChange={(e) => setPayTxnId(e.target.value)}
                  placeholder="e.g. UPI reference"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Record payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setPayModal({ open: false, appointment: null })}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default PaymentsPage





