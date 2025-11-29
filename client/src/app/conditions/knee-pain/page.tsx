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

export default function KneePainPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Pain while walking or climbing stairs",
    "Swelling",
    "Stiffness",
    "Instability"
  ]

  const treatments = [
    "Strengthening program",
    "Balance training",
    "Mobility restoration",
    "Functional rehab"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Knee Pain (ACL / Meniscus / Osteoarthritis)' }
      ]} />
      
      <ConditionHero
        title="Knee Pain"
        subtitle="ACL, Meniscus & Osteoarthritis Treatment"
        description="Comprehensive knee pain treatment for ACL injuries, meniscus tears, and osteoarthritis. Restore function and reduce pain."
        imageAlt="Knee pain physiotherapy treatment"
        imagePath="/therapies/kinesio-taping.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Knee strengthening exercise illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

