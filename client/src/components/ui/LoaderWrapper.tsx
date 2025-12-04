'use client'

import { useState, useEffect, useRef } from 'react'
import MedicalLoader from './MedicalLoader'

interface LoaderWrapperProps {
  children: React.ReactNode
  videoSrc?: string // Optional MP4 video path for loader
}

export default function LoaderWrapper({ children, videoSrc }: LoaderWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    // Only initialize once
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    // Prevent body scroll while loading
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <MedicalLoader 
          videoSrc={videoSrc}
          onLoadingChange={handleLoadingChange}
          onComplete={handleComplete}
        />
      )}
      <div 
        className={isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        style={{ 
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        {children}
      </div>
    </>
  )
}


