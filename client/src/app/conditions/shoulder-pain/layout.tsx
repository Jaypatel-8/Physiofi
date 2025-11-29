import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shoulder Pain Treatment - Frozen Shoulder & Rotator Cuff | PhysioFi',
  description: 'Expert physiotherapy for frozen shoulder and rotator cuff injuries. Joint mobilization, strengthening, and pain relief. Book home visit or tele-consultation.',
  keywords: 'shoulder pain, frozen shoulder, rotator cuff, shoulder physiotherapy, home visit, Ahmedabad',
}

export default function ShoulderPainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





