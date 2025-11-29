import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Urinary Incontinence Treatment | PhysioFi - Pelvic Floor Therapy',
  description: 'Specialized pelvic floor physiotherapy for urinary incontinence. Strengthen muscles and regain bladder control.',
  keywords: 'urinary incontinence, pelvic floor therapy, incontinence treatment, bladder control, pelvic floor exercises',
}

export default function UrinaryIncontinenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





