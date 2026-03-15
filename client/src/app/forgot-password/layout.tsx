import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password | PhysioFi',
  description: 'Reset your PhysioFi account password. Enter your email to receive a reset link.',
  robots: 'noindex, follow',
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
