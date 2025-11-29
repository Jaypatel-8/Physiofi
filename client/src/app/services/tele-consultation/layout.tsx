import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tele-Consultation Physiotherapy | PhysioFi - Online Physiotherapy Sessions',
  description: 'Online physiotherapy sessions with expert assessment, guided exercises, and progress tracking. Book tele-consultation from anywhere in India.',
  keywords: 'tele-consultation physiotherapy, online physiotherapy, virtual physiotherapy, tele-rehab, online consultation',
}

export default function TeleConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





