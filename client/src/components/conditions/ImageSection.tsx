'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ImageSectionProps {
  imageAlt: string
  title?: string
  description?: string
  imagePath?: string
}

const ImageSection = ({ imageAlt, title, description, imagePath }: ImageSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {title && description && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black text-gray-900 font-display">
                {title.split(' ').map((word, index) => {
                  const focusWords = ['PhysioFi', 'physiofi', 'symptoms', 'Symptoms', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits', 'Home', 'Visit', 'Pain', 'Rehabilitation', 'Doorstep', 'Anywhere']
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
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-light">
                {description}
              </p>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary-100 to-pastel-blue-100">
              <div className="aspect-[4/3] relative">
                {imagePath ? (
                  <Image
                    src={imagePath}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-40 h-40 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <span className="text-8xl">💪</span>
                      </div>
                      <p className="text-gray-600 font-medium">{imageAlt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ImageSection





