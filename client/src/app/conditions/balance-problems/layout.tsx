import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balance Problems & Fall Prevention | PhysioFi - Geriatric Care',
  description: 'Specialized balance and fall prevention programs for seniors. Improve stability and confidence in daily activities.',
  keywords: 'balance problems, fall prevention, geriatric physiotherapy, elderly care, balance training',
}

export default function BalanceProblemsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





