import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Low Back Pain & Sciatica Treatment | PhysioFi - Home Visit Physiotherapy',
  description: 'Expert physiotherapy for low back pain and sciatica. Spinal mobilization, core strengthening, and posture correction. Book home visit or tele-consultation in Ahmedabad, Mumbai, and Pan India.',
  keywords: 'low back pain treatment, sciatica physiotherapy, back pain relief, home visit physiotherapy, Ahmedabad, Mumbai',
}

export default function LowBackPainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}





