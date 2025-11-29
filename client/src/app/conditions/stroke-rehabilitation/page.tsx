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

export default function StrokeRehabilitationPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Weakness on one side",
    "Balance issues",
    "Difficulty walking",
    "Poor coordination"
  ]

  const treatments = [
    "Neuro-rehab",
    "Gait training",
    "Facilitation techniques",
    "Balance exercises"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Stroke Rehabilitation' }
      ]} />
      
      <ConditionHero
        title="Stroke Rehabilitation"
        description="Comprehensive neurological rehabilitation after stroke. Restore function, improve mobility, and regain independence with expert neuro-rehab."
        imageAlt="Stroke rehabilitation physiotherapy"
        imagePath="/therapies/neuro-physio.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Stroke rehabilitation exercise illustration" imagePath="/therapies/balance-gait.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

