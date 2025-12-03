'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CalendarDaysIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCallNow = () => {
    window.open('tel:+919082770384')
  }

  const handleBookAppointment = () => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
    setIsOpen(false)
  }

  const handleOnlineConsultation = () => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
    setIsOpen(false)
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/919082770384', '_blank')
  }

  const quickActions = [
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      label: "Call Now",
      action: handleCallNow,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      label: "Book Appointment",
      action: handleBookAppointment,
      color: "bg-primary-500 hover:bg-primary-600"
    },
    {
      icon: <VideoCameraIcon className="h-6 w-6" />,
      label: "Online Consultation",
      action: handleOnlineConsultation,
      color: "bg-deepTeal hover:bg-deepTeal-600"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      label: "WhatsApp",
      action: handleWhatsApp,
      color: "bg-green-600 hover:bg-green-700"
    }
  ]

  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="mb-4 space-y-3"
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={action.action}
                    className={`${action.color} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center space-x-3 group`}
                  >
                    {action.icon}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {action.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggleOpen}
          className={`${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-90`}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">📅</span>
              <span className="text-sm font-medium">Book Now</span>
            </div>
          )}
        </button>
      </div>

    </>
  )
}

export default FloatingActionButton