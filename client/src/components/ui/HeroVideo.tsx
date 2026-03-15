'use client'

import { useState, useEffect } from 'react'

// Premium physiotherapy-style background (Mixkit free license). Fallback when /videos/hero-bg.mp4 is missing.
const SAMPLE_VIDEO_URL = 'https://cdn.mixkit.co/videos/preview/mixkit-physiotherapist-massaging-a-womans-back-50295-large.mp4'

export default function HeroVideo({ useSample = true }: { useSample?: boolean }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVideoUrl(null)
      return
    }
    const localUrl = '/videos/hero-bg.mp4'
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.onloadeddata = () => setVideoUrl(localUrl)
    video.onerror = () => {
      if (useSample) setVideoUrl(SAMPLE_VIDEO_URL)
    }
    video.src = localUrl
    return () => {}
  }, [useSample])

  if (!videoUrl) return null

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
        src={videoUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-card-1/30 to-card-2/40" />
    </div>
  )
}
