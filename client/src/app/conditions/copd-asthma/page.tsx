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

export default function COPDAsthmaPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Breathlessness",
    "Fatigue",
    "Low endurance",
    "Wheezing"
  ]

  const treatments = [
    "Breathing techniques",
    "Chest physiotherapy",
    "Pulmonary rehab",
    "Strength conditioning"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'COPD / Asthma / Breathing Issues' }
      ]} />
      
      <ConditionHero
        title="COPD / Asthma"
        subtitle="Breathing Issues Treatment"
        description="Pulmonary rehabilitation for COPD, asthma, and breathing difficulties. Improve lung function and quality of life."
        imageAlt="Breathing therapy physiotherapy"
        imagePath="/therapies/strength-conditioning.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Breathing therapy illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

