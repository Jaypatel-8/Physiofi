'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const DASHBOARD_PALETTE = [
  { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600', border: 'border-primary-200/50' },
  { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600', border: 'border-pastel-blue-200/50' },
  { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600', border: 'border-pastel-mint-200/50' },
  { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600', border: 'border-pastel-lavender-200/50' },
  { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600', border: 'border-pastel-peach-200/50' },
  { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600', border: 'border-pastel-sage-200/50' },
]

interface QuickLinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay?: number
  index?: number
}

const QuickLinkCard = ({ href, icon, title, description, delay = 0, index = 0 }: QuickLinkCardProps) => {
  const style = DASHBOARD_PALETTE[index % DASHBOARD_PALETTE.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        href={href}
        className={`group block rounded-2xl border p-5 transition-all duration-200 ${style.bg} ${style.border} hover:shadow-md`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${style.iconBg} ${style.iconColor}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
          View <ArrowRightIcon className="h-3.5 w-3.5" />
        </span>
      </Link>
    </motion.div>
  )
}

export default QuickLinkCard
