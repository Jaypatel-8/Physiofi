'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  HomeIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import toast from 'react-hot-toast'

interface TimeSlot {
  start: string
  end: string
  type: 'Home Visit' | 'Online Consultation' | 'Clinic'
}

interface Availability {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

const APPOINTMENT_TYPES = [
  { value: 'Home Visit', label: 'Home Visit', icon: HomeIcon, color: 'bg-blue-100 text-blue-700' },
  { value: 'Online Consultation', label: 'Tele Consultation', icon: VideoCameraIcon, color: 'bg-green-100 text-green-700' },
  { value: 'Clinic', label: 'Clinic Visit', icon: CalendarDaysIcon, color: 'bg-purple-100 text-purple-700' }
]

export default function SetAvailabilityPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [availability, setAvailability] = useState<Availability>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>('monday')
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    start: '09:00',
    end: '10:00',
    type: 'Home Visit'
  })

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login')
      return
    }
    loadAvailability()
  }, [user, router])

  const loadAvailability = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getProfile()
      
      if (response.data.success) {
        const doctor = response.data.data
        setAvailability(doctor.availability || {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        })
      }
    } catch (error: any) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSlot = (day: string) => {
    if (!newSlot.start || !newSlot.end) {
      toast.error('Please enter start and end times')
      return
    }

    if (newSlot.start >= newSlot.end) {
      toast.error('End time must be after start time')
      return
    }

    setAvailability(prev => ({
      ...prev,
      [day]: [...(prev[day as keyof Availability] || []), { ...newSlot }]
    }))

    setNewSlot({
      start: '09:00',
      end: '10:00',
      type: 'Home Visit'
    })
  }

  const handleRemoveSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day as keyof Availability].filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await doctorAPI.updateAvailability({ availability })
      toast.success('Availability updated successfully!')
    } catch (error: any) {
      console.error('Error saving availability:', error)
      toast.error(error.response?.data?.message || 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = APPOINTMENT_TYPES.find(t => t.value === type)
    return typeConfig?.icon || CalendarDaysIcon
  }

  const getTypeColor = (type: string) => {
    const typeConfig = APPOINTMENT_TYPES.find(t => t.value === type)
    return typeConfig?.color || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading availability...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <CalendarDaysIcon className="h-10 w-10 text-primary-600" />
            <span>Set Availability</span>
          </h1>
          <p className="text-gray-600">Manage your weekly availability schedule</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Weekly Schedule</h3>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Save Availability</span>
                </>
              )}
            </button>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
            {DAYS.map(day => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedDay === day.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Selected Day Schedule */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {DAYS.find(d => d.key === selectedDay)?.label} Schedule
            </h4>

            {/* Add New Slot */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newSlot.end}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {APPOINTMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleAddSlot(selectedDay)}
                    className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Slot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Slots */}
            <div className="space-y-2">
              {availability[selectedDay as keyof Availability]?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No time slots added for this day</p>
                </div>
              ) : (
                availability[selectedDay as keyof Availability]?.map((slot, index) => {
                  const IconComponent = getTypeIcon(slot.type)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${getTypeColor(slot.type)} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {slot.start} - {slot.end}
                          </div>
                          <div className="text-sm text-gray-600">{slot.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(selectedDay, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-7 gap-4">
          {DAYS.map(day => (
            <div key={day.key} className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-primary-600">
                {availability[day.key as keyof Availability]?.length || 0}
              </div>
              <div className="text-sm text-gray-600">{day.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}






