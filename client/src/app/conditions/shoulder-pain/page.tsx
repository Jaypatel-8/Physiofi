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

export default function ShoulderPainPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const symptoms = [
    "Pain lifting arm",
    "Restricted movement",
    "Night pain",
    "Weakness"
  ]

  const treatments = [
    "Joint mobilization",
    "Strengthening plan",
    "Flexibility exercises",
    "Pain relief techniques"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Shoulder Pain (Frozen Shoulder / Rotator Cuff)' }
      ]} />
      
      <ConditionHero
        title="Shoulder Pain"
        subtitle="Frozen Shoulder & Rotator Cuff Treatment"
        description="Expert physiotherapy for frozen shoulder and rotator cuff injuries. Restore shoulder mobility and strength with personalized treatment."
        imageAlt="Shoulder pain physiotherapy treatment"
        imagePath="/therapies/manual-therapy.jpg"
      />

      <SymptomsList symptoms={symptoms} />
      <ImageSection imageAlt="Shoulder stiffness treatment illustration" imagePath="/therapies/strength-conditioning.jpg" />
      <TreatmentList treatments={treatments} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}

