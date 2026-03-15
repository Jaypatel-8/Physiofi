'use client'

/** Returns first letter of first name, or "U" as fallback */
export function getInitial(name: string | undefined | null): string {
  if (!name || !name.trim()) return 'U'
  const first = name.trim().split(/\s+/)[0]
  return (first[0] || 'U').toUpperCase()
}

interface UserAvatarProps {
  name?: string | null
  /** Size: sm (32px), md (40px), lg (48px) */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  const initial = getInitial(name)
  return (
    <div
      className={`rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {initial}
    </div>
  )
}
