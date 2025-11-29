import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'COPD & Asthma Treatment | PhysioFi - Pulmonary Rehabilitation',
  description: 'Pulmonary rehabilitation for COPD, asthma, and breathing difficulties. Breathing techniques, chest physiotherapy, and strength conditioning.',
  keywords: 'COPD treatment, asthma physiotherapy, pulmonary rehabilitation, breathing exercises, chest physiotherapy',
}

export default function COPDAsthmaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





