import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post-COVID Recovery | PhysioFi - Rehabilitation After COVID-19',
  description: 'Comprehensive rehabilitation after COVID-19. Gradual conditioning, breathing exercises, and strength restoration. Regain your energy.',
  keywords: 'post-COVID recovery, COVID rehabilitation, post-COVID physiotherapy, long COVID treatment',
}

export default function PostCovidLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





