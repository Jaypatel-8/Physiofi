import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Osteoporosis Treatment | PhysioFi - Bone Strengthening',
  description: 'Specialized physiotherapy for osteoporosis. Strengthen bones, improve posture, and reduce fracture risk.',
  keywords: 'osteoporosis treatment, bone strengthening, osteoporosis physiotherapy, fracture prevention',
}

export default function OsteoporosisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





