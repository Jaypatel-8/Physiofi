'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  UserGroupIcon, 
  TrophyIcon, 
  CalendarDaysIcon,
  HeartIcon,
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })
  }, [])

  const stats = [
    { number: "70+", label: "Patients", icon: UserGroupIcon },
    { number: "2+", label: "Years Experience", icon: CalendarDaysIcon },
    { number: "100%", label: "Client Satisfaction", icon: TrophyIcon }
  ]

  const teamMembers = [
    {
      name: "Dr. Arth Patel",
      role: "Founder & Chief Physiotherapist",
      specialization: "Orthopedic & Sports Rehabilitation",
      experience: "8+ years",
      education: "M.P.T (Master of Physiotherapy)",
      image: "/images/team/dr-arth.jpg",
      description: "Specialized in orthopedic and sports rehabilitation with extensive experience in treating athletes and post-surgical patients."
    },
    {
      name: "Dr. Prakruti Patel", 
      role: "Senior Physiotherapist",
      specialization: "Neurological & Pediatric Care",
      experience: "6+ years",
      education: "M.P.T (Master of Physiotherapy)",
      image: "/images/team/dr-prakruti.jpg",
      description: "Expert in neurological rehabilitation and pediatric physiotherapy, helping children with developmental delays and neurological conditions."
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Senior Physiotherapist", 
      specialization: "Cardiac & Geriatric Care",
      experience: "7+ years",
      education: "M.P.T (Master of Physiotherapy)",
      image: "/images/team/dr-rajesh.jpg",
      description: "Specialized in cardiac rehabilitation and geriatric care, helping elderly patients maintain independence and quality of life."
    },
    {
      name: "Dr. Priya Sharma",
      role: "Physiotherapist",
      specialization: "Women's Health & Pelvic Floor",
      experience: "4+ years", 
      education: "M.P.T (Master of Physiotherapy)",
      image: "/images/team/dr-priya.jpg",
      description: "Expert in women's health physiotherapy, including prenatal and postnatal care, pelvic floor rehabilitation, and women's wellness."
    }
  ]

  const values = [
    {
      icon: <HeartIcon className="h-12 w-12" />,
      title: "Care That Understands",
      description: "Empathy-driven treatment for every age and condition.",
      color: "from-pink-100 to-rose-100"
    },
    {
      icon: <ShieldCheckIcon className="h-12 w-12" />,
      title: "Quality Without Compromise",
      description: "Professional, certified physiotherapists with updated techniques.",
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: <AcademicCapIcon className="h-12 w-12 text-gray-600" />,
      title: "Personalised Rehab Plans",
      description: "Every body is different — your treatment should be too.",
      color: "bg-gray-50",
      border: "border-gray-400"
    },
    {
      icon: <StarIcon className="h-12 w-12" />,
      title: "Accessible & Affordable",
      description: "Expert care that fits your time, comfort, and budget.",
      color: "from-purple-100 to-violet-100"
    }
  ]

  const milestones = [
    {
      year: "2023",
      title: "The Beginning",
      description: "During her graduation years, Dr. Shruti saw how many patients struggled to visit clinics due to pain, mobility issues, and busy schedules. This inspired her to start PhysioFi as a home-visit physiotherapy service, offering affordable and personalised treatment right at the patient's doorstep.",
      icon: "📍"
    },
    {
      year: "2024", 
      title: "Expansion to Navi Mumbai",
      description: "After tremendous patient appreciation and strong results, PhysioFi expanded to Dr. Shruti's hometown — Navi Mumbai. This marked the brand's first step toward becoming a multi-city physiotherapy service.",
      icon: "📍"
    },
    {
      year: "2025",
      title: "Launch in Ahmedabad",
      description: "To serve more metro cities with quality physiotherapy, PhysioFi extended its services to Ahmedabad in 2025, strengthening its footprint in key urban regions.",
      icon: "📍"
    },
    {
      year: "Today",
      title: "Growing Into a Nationwide Brand",
      description: "PhysioFi now offers Home Visit Physiotherapy, Tele-Consultation, Advanced Therapy Treatments (Cupping, Dry Needling, IASTM & more), and Coming Soon: Premium Physiotherapy Clinics in Major Cities. Through every expansion, one promise remains constant: Bringing expert physiotherapy wherever the patient needs it.",
      icon: "✨"
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      
      {/* Hero Section - Modern Design */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 max-w-6xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 font-display leading-tight">
              ABOUT<br /><span className="text-primary-500">PHYSIOFI</span>
            </h1>
            <div className="lg:ml-auto lg:max-w-2xl">
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                PhysioFi is a modern physiotherapy brand dedicated to delivering personalised, evidence-based care through Home Visits, Tele-Consultations, and Advanced Therapy Services. We believe recovery should be accessible, comfortable, and built around the patient—not the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="text-center"
              >
                {(() => {
                  const colors = [
                    { border: 'border-teal-400', bg: 'bg-teal-50', text: 'text-teal-600' },
                    { border: 'border-deepTeal', bg: 'bg-deepTeal-50', text: 'text-deepTeal' },
                    { border: 'border-forest', bg: 'bg-forest-50', text: 'text-forest' }
                  ]
                  const color = colors[index % colors.length]
                  return (
                    <>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-white shadow-md`}>
                        <stat.icon className={`h-10 w-10 ${color.text}`} />
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${color.text}`}>{stat.number}</div>
                      <div className="text-gray-700 font-medium">{stat.label}</div>
                    </>
                  )
                })()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg font-medium">
                  A story of purpose, growth, and care—built step by step.
                </p>
                <p>
                  PhysioFi was born when Dr. Shruti Singh (PT) realised many patients could not reach clinics due to pain or mobility issues. She began providing affordable home physiotherapy, ensuring care reached every home that needed it.
                </p>
                <p>
                  Today, PhysioFi is evolving into a premium physiotherapy ecosystem offering Home Visits, Tele Consultations, Advanced Therapies, and Upcoming Physical Clinics in major cities.
                </p>
                <p className="font-semibold text-gray-900">
                  Our vision is simple — to make expert physiotherapy accessible everywhere.
                </p>
              </div>
            </div>
            <div data-aos="fade-left" className="space-y-6">
              <div className="bg-primary-50 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary-200"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-primary-100"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 font-display">Our Mission</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To empower individuals to restore movement, reduce pain, and improve quality of life through advanced physiotherapy tailored to each patient.
                  </p>
                </div>
                  </div>
              
              <div className="bg-pastel-blue-50 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-pastel-blue-200"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-pastel-blue-100"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 font-display">Our Vision</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To build India's most trusted physiotherapy ecosystem — a blend of home-based care, digital care, and premium physiotherapy centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
              Our <span className="text-primary-500">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our approach to patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`${
                  value.border ? value.color : 'bg-primary-50'
                } rounded-3xl p-8 text-center border-4 ${
                  value.border || 'border-teal-400'
                } hover:scale-110 transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden group`}
              >
                <div className={`mb-6 ${
                  value.border ? 'text-gray-600' : 'text-accent-400'
                }`}>
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto bg-white shadow-md`}>
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Redesigned */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sage-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 font-display">
              Our <span className="text-primary-500">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              A story of purpose, growth, and care—built step by step
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
          <div className="relative">
              <div className="space-y-16 relative">
              {milestones.map((milestone, index) => (
                  <motion.div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-8 items-start relative"
                  >
                    {/* Connecting Line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-12 top-24 w-0.5 h-16 bg-primary-300 opacity-30"></div>
                    )}
                    
                    {/* Year Badge */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 border-primary-200">
                        <span className="text-3xl mb-1">{milestone.icon}</span>
                        <div className="text-lg font-black text-primary-600">{milestone.year}</div>
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <div className="flex-grow bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      {/* Book Corner Effect */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 mb-4 font-display">{milestone.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{milestone.description}</p>
                  </div>
                  </div>
                  </motion.div>
                ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display">
            Ready to Start Your <span className="text-yellow-200">Recovery</span> <span className="text-yellow-200">Journey</span>?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied patients who have experienced exceptional care with PhysioFi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-accent-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors duration-300">
              Book Consultation
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-colors duration-300 shadow-md">
              Meet Our Team
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default AboutPage

