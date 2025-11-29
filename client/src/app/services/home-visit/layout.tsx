import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Visit Physiotherapy | PhysioFi - Professional Care at Your Doorstep',
  description: 'Professional physiotherapy delivered at your home for personalized, comfortable and time-saving treatment. Expert therapists in Ahmedabad, Mumbai, and Pan India.',
  keywords: 'home visit physiotherapy, physiotherapy at home, home physiotherapist, Ahmedabad, Mumbai, Pan India',
}

export default function HomeVisitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





