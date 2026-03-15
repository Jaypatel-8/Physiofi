'use client'

/**
 * Shows user initial in a circle. Used in dashboard header, sidebar, and layout.
 */
export default function UserAvatar({
  name,
  size = 'md',
  className = '',
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const displayName = (name || 'User').trim()
  const initial = displayName.charAt(0).toUpperCase() || 'U'
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {initial}
    </div>
  )
}
