import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spinal Cord Injury Rehabilitation | PhysioFi',
  description: 'Comprehensive rehabilitation for spinal cord injuries. Strengthening, mobility training, and functional independence programs.',
  keywords: 'spinal cord injury, SCI rehabilitation, spinal injury physiotherapy, mobility training',
}

export default function SpinalCordInjuryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





