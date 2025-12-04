'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CheckCircleIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

interface DateAvailability {
  date: string
  start: string
  end: string
  available: boolean
  note?: string
}

const DoctorAvailability = () => {
  const { user, loading } = useAuth()
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '09:00', end: '18:00' },
    tuesday: { available: true, start: '09:00', end: '18:00' },
    wednesday: { available: true, start: '09:00', end: '18:00' },
    thursday: { available: true, start: '09:00', end: '18:00' },
    friday: { available: true, start: '09:00', end: '18:00' },
    saturday: { available: true, start: '09:00', end: '14:00' },
    sunday: { available: false, start: '09:00', end: '18:00' }
  })
  const [dateAvailabilities, setDateAvailabilities] = useState<DateAvailability[]>([])
  const [newDateAvailability, setNewDateAvailability] = useState<DateAvailability>({
    date: '',
    start: '09:00',
    end: '18:00',
    available: true,
    note: ''
  })
  const [showDateForm, setShowDateForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
      return
    }
    if (user && user.role !== 'doctor') {
      window.location.href = '/'
      return
    }
    loadAvailability()
  }, [user, loading])

  const loadAvailability = async () => {
    try {
      const response = await doctorAPI.getAvailability()
      if (response.data.success && response.data.data) {
        const data = response.data.data
        // Load weekly availability
        if (data.weekly) {
          setAvailability(data.weekly)
        }
        // Load date-specific availability
        if (data.dates && Array.isArray(data.dates)) {
          setDateAvailabilities(data.dates)
        }
      }
    } catch (error) {
      console.error('Error loading availability:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const availabilityData = {
        weekly: availability,
        dates: dateAvailabilities
      }
      await doctorAPI.updateAvailability(availabilityData)
      toast.success('Availability updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update availability')
    } finally {
      setIsSaving(false)
    }
  }

  const updateDay = (day: string, field: string, value: any) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const addDateAvailability = () => {
    if (!newDateAvailability.date) {
      toast.error('Please select a date')
      return
    }
    if (newDateAvailability.start >= newDateAvailability.end) {
      toast.error('End time must be after start time')
      return
    }
    
    // Check if date already exists
    if (dateAvailabilities.some(da => da.date === newDateAvailability.date)) {
      toast.error('This date already has availability set')
      return
    }

    setDateAvailabilities([...dateAvailabilities, { ...newDateAvailability }])
    setNewDateAvailability({
      date: '',
      start: '09:00',
      end: '18:00',
      available: true,
      note: ''
    })
    setShowDateForm(false)
    toast.success('Date availability added')
  }

  const removeDateAvailability = (index: number) => {
    setDateAvailabilities(dateAvailabilities.filter((_, i) => i !== index))
    toast.success('Date availability removed')
  }

  const updateDateAvailability = (index: number, field: string, value: any) => {
    const updated = [...dateAvailabilities]
    updated[index] = { ...updated[index], [field]: value }
    setDateAvailabilities(updated)
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black mb-2 text-white">Update Availability</h1>
          <p className="text-white/90">Set your working hours and specific date availability</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Weekly Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary-600" />
              Weekly Schedule
            </h2>
            <div className="space-y-4">
              {days.map((day) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-32">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={availability[day as keyof typeof availability].available}
                        onChange={(e) => updateDay(day, 'available', e.target.checked)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="font-semibold text-gray-900 capitalize">{day}</span>
                    </label>
                  </div>
                  {availability[day as keyof typeof availability].available && (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-gray-500" />
                        <input
                          type="time"
                          value={availability[day as keyof typeof availability].start}
                          onChange={(e) => updateDay(day, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={availability[day as keyof typeof availability].end}
                          onChange={(e) => updateDay(day, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Date-Specific Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
                Specific Date Availability
              </h2>
              <button
                onClick={() => setShowDateForm(!showDateForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Date
              </button>
            </div>

            {/* Add Date Form */}
            <AnimatePresence>
              {showDateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newDateAvailability.date}
                        onChange={(e) => setNewDateAvailability({ ...newDateAvailability, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Available
                      </label>
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={newDateAvailability.available}
                          onChange={(e) => setNewDateAvailability({ ...newDateAvailability, available: e.target.checked })}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Available on this date</span>
                      </label>
                    </div>
                    {newDateAvailability.available && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            value={newDateAvailability.start}
                            onChange={(e) => setNewDateAvailability({ ...newDateAvailability, start: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Time *
                          </label>
                          <input
                            type="time"
                            value={newDateAvailability.end}
                            onChange={(e) => setNewDateAvailability({ ...newDateAvailability, end: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={newDateAvailability.note || ''}
                        onChange={(e) => setNewDateAvailability({ ...newDateAvailability, note: e.target.value })}
                        placeholder="e.g., Holiday, Special hours"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={addDateAvailability}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowDateForm(false)
                          setNewDateAvailability({
                            date: '',
                            start: '09:00',
                            end: '18:00',
                            available: true,
                            note: ''
                          })
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date Availability List */}
            {dateAvailabilities.length > 0 ? (
              <div className="space-y-3">
                {dateAvailabilities.map((dateAvail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(dateAvail.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      {dateAvail.available ? (
                        <>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Start Time</p>
                            <input
                              type="time"
                              value={dateAvail.start}
                              onChange={(e) => updateDateAvailability(index, 'start', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">End Time</p>
                            <input
                              type="time"
                              value={dateAvail.end}
                              onChange={(e) => updateDateAvailability(index, 'end', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <p className="font-semibold text-red-600">Not Available</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Note</p>
                        <input
                          type="text"
                          value={dateAvail.note || ''}
                          onChange={(e) => updateDateAvailability(index, 'note', e.target.value)}
                          placeholder="Optional note"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeDateAvailability(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No specific dates added yet</p>
                <p className="text-sm">Click "Add Date" to set availability for specific dates</p>
              </div>
            )}
          </motion.div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  Save Availability
                </>
              )}
            </button>
            <Link
              href="/doctor/dashboard"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default DoctorAvailability
