'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface SymptomsListProps {
  symptoms: string[]
  title?: string
}

const SymptomsList = ({ symptoms, title = "Common Symptoms" }: SymptomsListProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-black text-gray-900 mb-8 font-display text-center"
          >
            {(typeof title === 'string' ? title : 'Common Symptoms').split(' ').map((word, index, arr) => {
              const focusWords = ['Symptoms', 'symptoms', 'Common', 'PhysioFi', 'physiofi', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits']
              const cleanWord = word.replace(/[.,!?;:]/g, '')
              const isFocusWord = focusWords.some(fw => cleanWord.toLowerCase() === fw.toLowerCase())
              return isFocusWord ? (
                <span key={index} className="text-primary-500">
                  {word}{index < arr.length - 1 ? ' ' : ''}
                </span>
              ) : (
                <React.Fragment key={index}>{word}{index < arr.length - 1 ? ' ' : ''}</React.Fragment>
              )
            })}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {symptoms.map((symptom, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-pastel-blue-50 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-pastel-blue-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-700 font-medium pt-1">{symptom}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SymptomsList





