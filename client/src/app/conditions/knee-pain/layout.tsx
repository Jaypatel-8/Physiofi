import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knee Pain Treatment - ACL, Meniscus & Osteoarthritis | PhysioFi',
  description: 'Comprehensive knee pain treatment for ACL injuries, meniscus tears, and osteoarthritis. Strengthening, balance training, and functional rehab.',
  keywords: 'knee pain, ACL injury, meniscus tear, osteoarthritis, knee physiotherapy, home visit',
}

export default function KneePainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





