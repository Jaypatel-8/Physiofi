'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { HomeIcon } from '@heroicons/react/24/outline'

interface ConditionHeroProps {
  title: string
  subtitle?: string
  description: string
  imageAlt?: string
  imagePath?: string
}

const ConditionHero = ({ title, subtitle, description, imageAlt = "Physiotherapy treatment", imagePath }: ConditionHeroProps) => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sky-50 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
                Expert Physiotherapy Care
              </span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 font-display leading-tight">
              {title.split(' ').map((word, index) => {
                const focusWords = ['PhysioFi', 'physiofi', 'symptoms', 'Symptoms', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits', 'Home', 'Visit', 'Pain', 'Rehabilitation']
                const cleanWord = word.replace(/[.,!?;:]/g, '')
                const isFocusWord = focusWords.some(fw => cleanWord.toLowerCase() === fw.toLowerCase())
                return isFocusWord ? (
                  <span key={index} className="text-primary-500">
                    {word}{index < title.split(' ').length - 1 ? ' ' : ''}
                  </span>
                ) : (
                  <React.Fragment key={index}>{word}{index < title.split(' ').length - 1 ? ' ' : ''}</React.Fragment>
                )
              })}
              {subtitle && (
                <span className="block">
                  {subtitle.split(' ').map((word, index) => {
                    const focusWords = ['PhysioFi', 'physiofi', 'symptoms', 'Symptoms', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits', 'Home', 'Visit', 'Pain', 'Rehabilitation']
                    const cleanWord = word.replace(/[.,!?;:]/g, '')
                    const isFocusWord = focusWords.some(fw => cleanWord.toLowerCase() === fw.toLowerCase())
                    return isFocusWord ? (
                      <span key={index} className="text-primary-500">
                        {word}{index < subtitle.split(' ').length - 1 ? ' ' : ''}
                      </span>
                    ) : (
                      <React.Fragment key={index}>{word}{index < subtitle.split(' ').length - 1 ? ' ' : ''}</React.Fragment>
                    )
                  })}
                </span>
              )}
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              {description}
            </p>
          </motion.div>

          {/* Right Content - Image Only */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {imagePath ? (
              <div className="rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-100 to-pastel-mint-100">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={imagePath}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-100 to-pastel-mint-100">
                <div className="aspect-[4/3] relative flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <HomeIcon className="h-16 w-16 text-primary-500" />
                    </div>
                    <p className="text-gray-600 font-medium">{imageAlt}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ConditionHero





