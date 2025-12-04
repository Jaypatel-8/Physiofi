'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface MedicalLoaderProps {
  onComplete?: () => void
  onLoadingChange?: (isLoading: boolean) => void
}

const MedicalLoader = ({ onComplete, onLoadingChange }: MedicalLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [displayedText, setDisplayedText] = useState('')
  const [iconFillProgress, setIconFillProgress] = useState(0)
  const hasCompletedRef = useRef(false)
  const fullText = 'PhysioFi'

  useEffect(() => {
    // Prevent multiple executions
    if (hasCompletedRef.current) return

    if (onLoadingChange) {
      onLoadingChange(true)
    }

    // Icon fill animation - gradually fills with color
    const fillDuration = 1200 // 1.2 seconds
    const fillInterval = 16 // ~60fps
    const fillSteps = fillDuration / fillInterval
    let fillStep = 0
    
    const fillAnimation = setInterval(() => {
      fillStep++
      const progress = Math.min((fillStep / fillSteps) * 100, 100)
      setIconFillProgress(progress)
      
      if (progress >= 100) {
        clearInterval(fillAnimation)
      }
    }, fillInterval)

    // Typewriter animation for logo text - starts after icon animation begins
    let currentIndex = 0
    const typeDelay = 600 // Start typing after icon animation starts
    const typeInterval = setTimeout(() => {
      const typeAnimation = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeAnimation)
        }
      }, 100) // Speed of typing (100ms per letter)
    }, typeDelay)

    // Minimum display time
    const minDisplayTime = 2500 // 2.5 seconds minimum to see all animations
    
    // Track when page is ready
    let pageReady = false
    let pageLoadStartTime = Date.now()

    // Check if page is loaded - simplified logic
    const checkPageLoad = () => {
      if (hasCompletedRef.current) return
      
      if (document.readyState === 'complete') {
        pageReady = true
        const elapsed = Date.now() - pageLoadStartTime
        const remainingTime = Math.max(0, minDisplayTime - elapsed)
        
        setTimeout(() => {
          if (hasCompletedRef.current) return
          hasCompletedRef.current = true
          
          setIsVisible(false)
          if (onLoadingChange) {
            onLoadingChange(false)
          }
          if (onComplete) {
            setTimeout(onComplete, 300)
          }
        }, remainingTime + 300)
      }
    }

    // Check immediately if already loaded
    if (document.readyState === 'complete') {
      pageLoadStartTime = Date.now()
      checkPageLoad()
    } else {
      pageLoadStartTime = Date.now()
      window.addEventListener('load', checkPageLoad, { once: true })
    }

    // Fallback: fade out after minimum display time
    const maxTimer = setTimeout(() => {
      if (!pageReady && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        setTimeout(() => {
          setIsVisible(false)
          if (onLoadingChange) {
            onLoadingChange(false)
          }
          if (onComplete) {
            setTimeout(onComplete, 300)
          }
        }, 300)
      }
    }, minDisplayTime + 500)

    return () => {
      clearInterval(fillAnimation)
      clearTimeout(typeInterval)
      clearTimeout(maxTimer)
      window.removeEventListener('load', checkPageLoad)
    }
  }, []) // Empty dependency array - only run once on mount

  if (!isVisible) return null

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-primary-50/20 to-white"
        >
          <div className="flex flex-col items-center justify-center space-y-6 px-4">
            {/* Modern Horizontal Layout: Icon + Text */}
            <div className="flex items-center justify-center gap-5 md:gap-7">
              {/* Icon with Smooth Fill Animation */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                {/* Icon Container with Fill Animation */}
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  {/* Base Icon - starts grayscale */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      filter: [
                        'grayscale(100%) brightness(0.4)',
                        `grayscale(${100 - iconFillProgress}%) brightness(${0.4 + (iconFillProgress / 100) * 0.6})`,
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src="/Physiofi Logo icon.png"
                      alt="PhysioFi Logo"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                      priority
                      unoptimized
                    />
                  </motion.div>
                  
                  {/* Colored overlay that fades in from bottom to top */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(${100 - iconFillProgress}% 0 0 0)`,
                    }}
                    transition={{
                      duration: 0.05,
                      ease: "linear"
                    }}
                  >
                    <Image
                      src="/Physiofi Logo icon.png"
                      alt="PhysioFi Logo"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                      style={{
                        filter: 'brightness(1.2) saturate(1.4)',
                      }}
                      priority
                      unoptimized
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Text with Writing Animation using Barbara font */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
                  style={{
                    fontFamily: 'var(--font-barbara), "Bebas Neue", "Arial Black", sans-serif',
                    letterSpacing: '0.03em',
                    lineHeight: '1.1',
                  }}
                >
                  <span className="text-primary-500">
                    {displayedText}
                    {displayedText.length < fullText.length && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-primary-400 ml-1"
                      >
                        |
                      </motion.span>
                    )}
                  </span>
                </h1>
              </motion.div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MedicalLoader
