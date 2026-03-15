'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface CTASectionProps {
  title?: string
  description?: string
}

const CTASection = ({ 
  title = "Ready to Start Your Recovery Journey?",
  description = "Book your consultation today and take the first step towards better health."
}: CTASectionProps) => {
  const handleBookHomeVisit = () => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }

  const handleBookTeleConsultation = () => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary-300 via-pastel-mint-300 to-pastel-sky-300">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">
            {(typeof title === 'string' ? title : 'Ready to Start Your Recovery Journey?').split(' ').map((word, index, arr) => {
              const focusWords = ['PhysioFi', 'physiofi', 'symptoms', 'Symptoms', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits', 'Journey', 'Start']
              const cleanWord = word.replace(/[.,!?;:]/g, '')
              const isFocusWord = focusWords.some(fw => cleanWord.toLowerCase() === fw.toLowerCase())
              return isFocusWord ? (
                <span key={index} className="text-yellow-200">
                  {word}{index < arr.length - 1 ? ' ' : ''}
                </span>
              ) : (
                <React.Fragment key={index}>{word}{index < arr.length - 1 ? ' ' : ''}</React.Fragment>
              )
            })}
          </h2>
          <p className="text-xl text-white/95 mb-10 font-light">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookHomeVisit}
              className="bg-white text-primary-700 hover:bg-gray-50 font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Book Home Visit
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleBookTeleConsultation}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-700 font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2 text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Book Tele-Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection

