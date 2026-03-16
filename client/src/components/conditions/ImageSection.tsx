'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { HomeIcon } from '@heroicons/react/24/outline'

interface ImageSectionProps {
  imageAlt: string
  title?: string
  description?: string
  imagePath?: string
}

const ImageSection = ({ imageAlt, title, description, imagePath }: ImageSectionProps) => {
  const [imageFailed, setImageFailed] = useState(false)
  const showPlaceholder = !imagePath || imageFailed
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          {title && description && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-900 font-display"
              >
                {(typeof title === 'string' ? title : '').split(' ').map((word, index, arr) => {
                  const focusWords = ['PhysioFi', 'physiofi', 'symptoms', 'Symptoms', 'Recovery', 'Treatment', 'Expert', 'Care', 'Better', 'Health', 'Therapy', 'Help', 'Benefits', 'Home', 'Visit', 'Pain', 'Rehabilitation', 'Doorstep', 'Anywhere']
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
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-lg text-gray-700 leading-relaxed font-light"
              >
                {description}
              </motion.p>
            </motion.div>
          )}
          
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary-100 to-pastel-blue-100">
              <div className="aspect-[4/3] relative">
                {!showPlaceholder ? (
                  <Image
                    src={imagePath}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    quality={70}
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-pastel-blue-100">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <HomeIcon className="h-16 w-16 text-primary-500" />
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





