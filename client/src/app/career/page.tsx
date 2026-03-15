'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { motion } from 'framer-motion'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'
import { 
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const CareerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    resume: null as File | null,
    coverLetter: ''
  })

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    // Form submission logic will be implemented here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      })
    }
  }

  const openPositions = [
    {
      title: "Senior Physiotherapist",
      department: "Clinical Services",
      location: "Ahmedabad",
      type: "Full-time",
      experience: "3-5 years",
      description: "We are looking for an experienced physiotherapist to join our team and provide high-quality patient care.",
      requirements: [
        "Master's degree in Physiotherapy",
        "3+ years of clinical experience",
        "Valid physiotherapy license",
        "Experience in orthopedic and neurological rehabilitation",
        "Strong communication skills"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Professional development opportunities",
        "Flexible working hours",
        "Performance bonuses"
      ],
      color: "bg-teal-50",
      iconColor: "border-teal-400",
      textColor: "text-teal-600"
    },
    {
      title: "Home Visit Physiotherapist",
      department: "Home Care Services",
      location: "Ahmedabad",
      type: "Full-time",
      experience: "2-4 years",
      description: "Join our home care team to provide physiotherapy services directly to patients in their homes.",
      requirements: [
        "Bachelor's degree in Physiotherapy",
        "2+ years of experience",
        "Valid physiotherapy license",
        "Own vehicle for home visits",
        "Patient-centered approach"
      ],
      benefits: [
        "Travel allowance",
        "Flexible schedule",
        "Competitive compensation",
        "Professional growth",
        "Team support"
      ],
      color: "bg-deepTeal-50",
      iconColor: "border-deepTeal",
      textColor: "text-deepTeal"
    },
    {
      title: "Teleconsultation Specialist",
      department: "Digital Health",
      location: "Remote",
      type: "Part-time/Full-time",
      experience: "1-3 years",
      description: "Provide online physiotherapy consultations and develop digital treatment programs for patients.",
      requirements: [
        "Bachelor's degree in Physiotherapy",
        "1+ years of experience",
        "Tech-savvy and comfortable with video calls",
        "Good communication skills",
        "Experience with digital health platforms"
      ],
      benefits: [
        "Work from home",
        "Flexible hours",
        "Competitive hourly rate",
        "Technology support",
        "Training provided"
      ],
      color: "bg-forest-50",
      iconColor: "border-forest",
      textColor: "text-forest"
    },
    {
      title: "Rehabilitation Assistant",
      department: "Support Services",
      location: "Ahmedabad",
      type: "Full-time",
      experience: "0-2 years",
      description: "Support our physiotherapists in delivering patient care and maintaining clinic operations.",
      requirements: [
        "Diploma in Physiotherapy or related field",
        "Fresh graduates welcome",
        "Basic knowledge of physiotherapy",
        "Good interpersonal skills",
        "Willingness to learn"
      ],
      benefits: [
        "Training provided",
        "Career growth opportunities",
        "Competitive starting salary",
        "Health benefits",
        "Mentorship program"
      ],
      color: "bg-teal-50",
      iconColor: "border-teal-400",
      textColor: "text-teal-600"
    }
  ]

  const benefits = [
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Meaningful Work",
      description: "Make a real difference in patients' lives and recovery journeys"
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-gray-600" />,
      title: "Professional Growth",
      description: "Continuous learning opportunities and career development programs"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Job Security",
      description: "Stable employment with a growing healthcare organization"
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Team Environment",
      description: "Collaborative work culture with supportive colleagues"
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: "Work-Life Balance",
      description: "Flexible schedules and reasonable working hours"
    },
    {
      icon: <StarIcon className="h-8 w-8" />,
      title: "Recognition",
      description: "Performance-based rewards and recognition programs"
    }
  ]

  const values = [
    {
      icon: <HeartIcon className="h-12 w-12" />,
      title: "Patient-Centered Care",
      description: "We prioritize our patients' well-being and recovery above all else",
      color: "bg-deepTeal-50"
    },
    {
      icon: <LightBulbIcon className="h-12 w-12" />,
      title: "Innovation",
      description: "We embrace new technologies and treatment methods to improve care",
      color: "bg-forest-50"
    },
    {
      icon: <UserGroupIcon className="h-12 w-12" />,
      title: "Collaboration",
      description: "We work together as a team to achieve the best outcomes for our patients",
      color: "bg-teal-50"
    },
    {
      icon: <AcademicCapIcon className="h-12 w-12 text-gray-600" />,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do",
      color: "bg-deepTeal-50"
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>

      <PageHero
        label="Career"
        title="Join our team"
        subtitle="Be part of a team making a real difference. Help us deliver exceptional physiotherapy care."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-hero-primary"
          >
            View open positions
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-hero-secondary"
          >
            Apply now
          </motion.button>
        </div>
      </PageHero>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a team that values your growth, recognizes your contributions, and provides meaningful work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
              >
                <div className="text-accent-400 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and shape our culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`${value.color} rounded-2xl p-8 text-center border-2 border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="text-accent-400 mb-6">
                  {value.icon}
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

      {/* Open Positions */}
      <section id="open-positions" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our current job openings and find the perfect role for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {openPositions.map((position, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`${position.color} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-200`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${position.textColor} mb-2 font-display`}>
                      {position.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-4 ${position.iconColor} bg-white`}>
                    <BriefcaseIcon className={`h-6 w-6 ${position.iconColor.replace('border-', 'text-')}`} />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">{position.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-white/50 px-3 py-1 rounded-full">{position.type}</span>
                    <span className="bg-white/50 px-3 py-1 rounded-full">{position.experience}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Requirements:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Benefits:</h4>
                    <ul className="space-y-1">
                      {position.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <StarIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className={`w-full ${position.textColor} bg-white hover:opacity-80 font-semibold py-3 px-6 rounded-xl transition-opacity duration-300`}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
                Apply Now
              </h2>
              <p className="text-xl text-gray-600">
                Ready to join our team? Fill out the application form below.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                      Position Applied For *
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                    >
                      <option value="">Select position</option>
                      <option value="senior-physiotherapist">Senior Physiotherapist</option>
                      <option value="home-visit-physiotherapist">Home Visit Physiotherapist</option>
                      <option value="teleconsultation-specialist">Teleconsultation Specialist</option>
                      <option value="rehabilitation-assistant">Rehabilitation Assistant</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level *
                    </label>
                    <select
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                    >
                      <option value="">Select education</option>
                      <option value="diploma">Diploma in Physiotherapy</option>
                      <option value="bachelor">Bachelor&apos;s in Physiotherapy</option>
                      <option value="master">Master&apos;s in Physiotherapy</option>
                      <option value="phd">PhD in Physiotherapy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary-400 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold text-primary-600 group-hover:text-primary-700">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 5MB)</p>
                        {formData.resume && (
                          <p className="mt-2 text-sm font-medium text-primary-600">
                            Selected: {formData.resume.name}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                    placeholder="Tell us why you want to join PhysioFi and what makes you a great fit for this role..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn-primary text-lg px-12 py-4"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join our team and help us provide exceptional physiotherapy care to patients across Ahmedabad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors duration-300">
              View All Positions
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-colors duration-300">
              Contact HR
            </button>
          </div>
        </div>
      </section>

      <div id="footer-section">
        <Footer />
      </div>
    </main>
  )
}

export default CareerPage

