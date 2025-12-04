'use client'

import { ReactNode } from 'react'

interface LoaderWrapperProps {
  children: ReactNode
  videoSrc?: string
}

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  // Simply render children without any loader
  return <>{children}</>
}
