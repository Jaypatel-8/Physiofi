import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Parkinson's Disease Physiotherapy | PhysioFi - Movement Re-education",
  description: "Specialized physiotherapy for Parkinson's disease. Movement re-education, gait stability, and balance training. Improve quality of life.",
  keywords: "Parkinson's disease, Parkinson's physiotherapy, movement disorders, neurological rehabilitation",
}

export default function ParkinsonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





