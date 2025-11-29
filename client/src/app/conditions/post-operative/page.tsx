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

export default function PostOperativePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Pain",
    "Weakness",
    "Low mobility",
    "Difficulty with daily tasks"
  ]

  const treatments = [
    "Post-surgery protocols",
    "Strength rebuilding",
    "Swelling management",
    "Functional recovery"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Post-Operative Rehabilitation' }
      ]} />
      
      <ConditionHero
        title="Post-Operative Rehabilitation"
        description="Comprehensive rehabilitation after surgery. Expert care to restore function, strength, and mobility following surgical procedures."
        imageAlt="Post-operative rehabilitation physiotherapy"
        imagePath="/therapies/manual-therapy.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Post-operative rehabilitation illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

