'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="bg-white py-4 border-b border-gray-100">
      <div className="container-custom">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-600 hover:text-primary-400 transition-colors">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              {item.href ? (
                <Link href={item.href} className="text-gray-600 hover:text-primary-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb





