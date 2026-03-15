'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface ThemedCalendarProps {
  selectedDate: string | null
  onDateSelect: (date: string) => void
  minDate?: string
  maxDate?: string
  disabledDates?: string[]
  className?: string
}

const ThemedCalendar = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabledDates = [],
  className = ''
}: ThemedCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0]
    
    // Check if before min date
    if (minDate && dateStr < minDate) return true
    
    // Check if after max date
    if (maxDate && dateStr > maxDate) return true
    
    // Check if in disabled dates
    if (disabledDates.includes(dateStr)) return true
    
    // Check if in the past
    const todayStr = today.toISOString().split('T')[0]
    if (dateStr < todayStr) return true
    
    return false
  }
  
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr === selectedDate
  }
  
  const isToday = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    return dateStr === todayStr
  }
  
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    const dateStr = date.toISOString().split('T')[0]
    onDateSelect(dateStr)
  }
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }
  
  const renderDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      )
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const disabled = isDateDisabled(date)
      const selected = isDateSelected(date)
      const isTodayDate = isToday(date)
      
      days.push(
        <motion.button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className={`
            aspect-square rounded-xl font-semibold text-sm transition-all duration-200
            ${disabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : selected
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg'
                : isTodayDate
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
            }
          `}
        >
          {day}
        </motion.button>
      )
    }
    
    return days
  }
  
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={goToPreviousMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-black text-gray-900">
            {monthNames[month]} {year}
          </h3>
        </div>
        
        <motion.button
          onClick={goToNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary-100 border-2 border-primary-300"></div>
          <span className="text-gray-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-primary-500 to-primary-600"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-100"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>
    </div>
  )
}

export default ThemedCalendar





