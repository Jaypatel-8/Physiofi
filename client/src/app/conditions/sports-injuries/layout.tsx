import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sports Injuries Treatment & Rehabilitation | PhysioFi',
  description: 'Specialized sports injury rehabilitation. Injury recovery, strength & conditioning, and return-to-sport programs. Expert physiotherapy for athletes.',
  keywords: 'sports injury, sports physiotherapy, injury rehabilitation, return to sport, athlete physiotherapy',
}

export default function SportsInjuriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





