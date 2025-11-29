'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import ConditionHero from '@/components/conditions/ConditionHero'
import SymptomsList from '@/components/conditions/SymptomsList'
import TreatmentList from '@/components/conditions/TreatmentList'
import WhyChooseSection from '@/components/conditions/WhyChooseSection'
import CTASection from '@/components/conditions/CTASection'
import ImageSection from '@/components/conditions/ImageSection'

export default function NeckPainPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Neck stiffness",
    "Pain radiating to shoulders or arms",
    "Headaches",
    "Reduced neck movement"
  ]

  const treatments = [
    "Manual therapy",
    "Posture retraining",
    "Stretching & strengthening",
    "Mobility exercises"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Neck Pain / Cervical Spondylosis' }
      ]} />
      
      <ConditionHero
        title="Neck Pain"
        subtitle="Cervical Spondylosis Treatment"
        description="Professional treatment for neck pain and cervical spondylosis. Restore mobility, reduce pain, and improve your quality of life."
        imageAlt="Neck pain physiotherapy treatment"
        imagePath="/therapies/manual-therapy.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Neck pain posture correction illustration" imagePath="/therapies/posture-correction.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

