import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pregnancy-Related Pain Treatment | PhysioFi',
  description: 'Safe, gentle physiotherapy during and after pregnancy. Relieve back pain, pelvic discomfort, and improve mobility.',
  keywords: 'pregnancy pain, pregnancy physiotherapy, prenatal physiotherapy, postpartum recovery, pelvic pain',
}

export default function PregnancyPainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





