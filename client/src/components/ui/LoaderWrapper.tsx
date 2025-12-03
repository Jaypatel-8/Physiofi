'use client'

import { useState, useEffect } from 'react'
import PhysiofiFullLogoLoader from './PhysiofiFullLogoLoader'

interface LoaderWrapperProps {
  children: React.ReactNode
}

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

  return (
    <>
      <PhysiofiFullLogoLoader 
        onLoadingChange={setIsLoading}
        onComplete={() => setIsLoading(false)}
      />
      <div 
        style={{ 
          display: isLoading ? 'none' : 'block',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: isLoading ? 'none' : 'auto'
        }}
      >
        {children}
      </div>
    </>
  )
}

