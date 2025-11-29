import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pediatric Physiotherapy - Developmental Delay | PhysioFi',
  description: 'Specialized care for children with developmental delays. Play-based therapy to improve motor skills and development. Expert pediatric physiotherapy.',
  keywords: 'pediatric physiotherapy, developmental delay, children physiotherapy, motor skills development, child rehabilitation',
}

export default function PediatricDevelopmentalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





