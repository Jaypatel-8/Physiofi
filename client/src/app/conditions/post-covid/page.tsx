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

export default function PostCovidPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Weakness",
    "Fatigue",
    "Breathlessness",
    "Body pain"
  ]

  const treatments = [
    "Gradual conditioning",
    "Breathing exercises",
    "Strength restoration",
    "Functional recovery plan"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Post-COVID Recovery' }
      ]} />
      
      <ConditionHero
        title="Post-COVID Recovery"
        description="Comprehensive rehabilitation after COVID-19. Restore strength, improve breathing, and regain your energy."
        imageAlt="Post-COVID recovery physiotherapy"
        imagePath="/therapies/strength-conditioning.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Post-COVID recovery illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

