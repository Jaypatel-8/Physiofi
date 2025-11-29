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

export default function SportsInjuriesPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Sprains or strains",
    "Swelling",
    "Movement difficulty",
    "Tenderness"
  ]

  const treatments = [
    "Injury rehabilitation",
    "Strength & conditioning",
    "Return-to-sport programs",
    "Taping + prevention"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Sports Injuries' }
      ]} />
      
      <ConditionHero
        title="Sports Injuries"
        description="Specialized sports injury rehabilitation. Get back to your sport faster with expert physiotherapy and return-to-sport programs."
        imageAlt="Sports injury physiotherapy treatment"
        imagePath="/therapies/kinesio-taping.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Sports injury rehabilitation illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

