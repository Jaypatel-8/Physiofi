'use client'

import { motion } from 'framer-motion'

export const StatsCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-white/30 rounded mb-3"></div>
          <div className="h-10 w-16 bg-white/40 rounded mb-2"></div>
        </div>
        <div className="w-14 h-14 bg-white/30 rounded-2xl"></div>
      </div>
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-20 bg-gray-100 rounded-xl"></div>
        <div className="h-20 bg-gray-100 rounded-xl"></div>
        <div className="h-20 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  )
}

export const QuickLinkSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 animate-pulse">
      <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4"></div>
      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-100 rounded"></div>
    </div>
  )
}




