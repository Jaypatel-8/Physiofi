import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Torticollis Treatment for Children | PhysioFi',
  description: 'Gentle, effective treatment for torticollis in children. Restore normal head position and neck movement with specialized pediatric care.',
  keywords: 'torticollis, torticollis treatment, children torticollis, neck pain children, pediatric neck treatment',
}

export default function TorticollisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





