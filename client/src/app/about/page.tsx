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
      description: "During her graduation years, Dr. Shruti saw how many patients struggled to visit clinics due to pain, mobility issues, and busy schedules. This inspired her to start PhysioFi as a home-visit physiotherapy service, offering affordable and personalised treatment right at the patient's doorstep."
    },
    {
      year: "2024", 
      title: "Expansion to Navi Mumbai",
      description: "After tremendous patient appreciation and strong results, PhysioFi expanded to Dr. Shruti's hometown — Navi Mumbai. This marked the brand's first step toward becoming a multi-city physiotherapy service."
    },
    {
      year: "2025",
      title: "Launch in Ahmedabad",
      description: "To serve more metro cities with quality physiotherapy, PhysioFi extended its services to Ahmedabad in 2025, strengthening its footprint in key urban regions."
    },
    {
      year: "Today",
      title: "Growing Into a Nationwide Brand",
      description: "PhysioFi now offers Home Visit Physiotherapy, Tele-Consultation, Advanced Therapy Treatments (Cupping, Dry Needling, IASTM & more), and Coming Soon: Premium Physiotherapy Clinics in Major Cities. Through every expansion, one promise remains constant: Bringing expert physiotherapy wherever the patient needs it."
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

      {/* Timeline - Ultra Modern Sleek Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-8"
            >
              <span className="text-primary-600 text-xs font-bold tracking-[0.2em] uppercase">
                Our Journey
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 font-display tracking-tighter"
            >
              Our <span className="text-primary-500">Journey</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-xl mx-auto font-light tracking-wide"
            >
              A story of purpose, growth, and care—built step by step
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Ultra Minimal Vertical Timeline Line */}
              <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
              
              <div className="space-y-32 md:space-y-40">
                {milestones.map((milestone, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 80 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-150px" }}
                      transition={{ 
                        delay: index * 0.08, 
                        duration: 1,
                        ease: [0.19, 1, 0.22, 1]
                      }}
                      className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Minimal Timeline Dot */}
                      <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full z-20 flex-shrink-0"></div>
                      
                      {/* Year Badge - Mobile */}
                      <div className="md:hidden flex-shrink-0">
                        <div className="text-primary-500 text-4xl font-black tracking-tight">
                          {milestone.year}
                        </div>
                      </div>
                      
                      {/* Content Card - Ultra Modern */}
                      <div className={`flex-1 ${
                        isEven 
                          ? 'md:pr-16 md:text-right md:ml-auto md:max-w-[46%]' 
                          : 'md:pl-16 md:text-left md:mr-auto md:max-w-[46%]'
                      }`}>
                        <motion.div
                          whileHover={{ 
                            y: -12,
                            transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] }
                          }}
                          className="group relative"
                        >
                          {/* Year - Desktop */}
                          <div className={`hidden md:block mb-8 ${
                            isEven ? 'text-right' : 'text-left'
                          }`}>
                            <div className="text-primary-500 text-5xl font-black tracking-tighter inline-block">
                              {milestone.year}
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="relative">
                            <h3 className={`text-3xl md:text-4xl font-black text-gray-900 mb-6 font-display tracking-tight leading-tight ${
                              isEven ? 'md:text-right' : ''
                            }`}>
                              {milestone.title}
                            </h3>
                            <p className={`text-gray-500 leading-relaxed text-lg md:text-xl font-light tracking-wide ${
                              isEven ? 'md:text-right' : ''
                            }`}>
                              {milestone.description}
                            </p>
                            
                            {/* Subtle Underline on Hover */}
                            <div className={`absolute bottom-0 ${
                              isEven ? 'right-0' : 'left-0'
                            } w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-700 ease-out`}></div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Spacer for desktop layout */}
                      <div className="hidden md:block w-[46%]"></div>
                    </motion.div>
                  )
                })}
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

