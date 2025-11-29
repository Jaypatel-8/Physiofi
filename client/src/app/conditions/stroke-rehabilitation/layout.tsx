import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stroke Rehabilitation | PhysioFi - Neuro-Rehabilitation Services',
  description: 'Comprehensive neurological rehabilitation after stroke. Neuro-rehab, gait training, and balance exercises. Restore function and independence.',
  keywords: 'stroke rehabilitation, neuro-rehabilitation, stroke recovery, neurological physiotherapy, gait training',
}

export default function StrokeRehabilitationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





