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

export default function LowBackPainPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Sharp or dull lower-back pain",
    "Pain radiating to legs",
    "Tingling or numbness",
    "Difficulty bending or sitting"
  ]

  const treatments = [
    "Spinal mobilization",
    "Core strengthening",
    "Posture correction",
    "Ergonomic guidance"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Low Back Pain / Sciatica' }
      ]} />
      
      <ConditionHero
        title="Low Back Pain"
        subtitle="Sciatica Treatment"
        description="Expert physiotherapy for low back pain and sciatica. Comprehensive treatment to relieve pain, restore mobility, and prevent recurrence."
        imageAlt="Low back pain physiotherapy treatment"
        imagePath="/therapies/cupping-therapy.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Low back pain treatment illustration" imagePath="/therapies/manual-therapy.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

