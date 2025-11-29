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

export default function PediatricDevelopmentalPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Late crawling/walking",
    "Poor coordination",
    "Muscle weakness"
  ]

  const treatments = [
    "Motor skill training",
    "Strengthening",
    "Play-based therapy",
    "Parent coaching"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Pediatric Physiotherapy (Developmental Delay)' }
      ]} />
      
      <ConditionHero
        title="Pediatric Physiotherapy"
        subtitle="Developmental Delay Treatment"
        description="Specialized care for children with developmental delays. Play-based therapy to improve motor skills and development."
        imageAlt="Pediatric developmental physiotherapy"
        imagePath="/therapies/pediatric-advanced.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Pediatric development therapy illustration" imagePath="/therapies/pediatric-advanced.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

