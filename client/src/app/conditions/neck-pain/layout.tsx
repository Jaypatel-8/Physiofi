import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neck Pain & Cervical Spondylosis Treatment | PhysioFi',
  description: 'Professional treatment for neck pain and cervical spondylosis. Manual therapy, posture retraining, and mobility exercises. Book home visit or tele-consultation.',
  keywords: 'neck pain treatment, cervical spondylosis, neck pain physiotherapy, home visit, Ahmedabad, Mumbai',
}

export default function NeckPainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





