import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post-Operative Rehabilitation | PhysioFi - Post-Surgery Recovery',
  description: 'Comprehensive rehabilitation after surgery. Post-surgery protocols, strength rebuilding, and functional recovery. Expert post-operative physiotherapy.',
  keywords: 'post-operative rehabilitation, post-surgery physiotherapy, surgical recovery, rehabilitation after surgery',
}

export default function PostOperativeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





