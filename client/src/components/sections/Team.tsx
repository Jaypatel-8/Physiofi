'use client'

import { motion } from 'framer-motion'
import { UserIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline'

const Team = () => {
  const doctors = [
    {
      name: "Dr. Arth Patel",
      title: "Senior Pediatric Physiotherapist",
      image: "/images/dr-arth-patel.jpg",
      qualifications: ["MSc Physiotherapy", "Pediatric Specialist"],
      experience: "8+ Years",
      specializations: ["Pediatric Physiotherapy", "Sports Injuries", "Neurological Rehabilitation"],
      rating: 4.9
    },
    {
      name: "Dr. Prakruti Patel", 
      title: "Senior Pediatric Occupational Therapist",
      image: "/images/dr-prakruti-patel.jpg",
      qualifications: ["MSc Occupational Therapy", "BOT", "Pediatric Specialist"],
      experience: "6+ Years",
      specializations: ["Occupational Therapy", "Sensory Integration", "Developmental Therapy"],
      rating: 4.8
    },
    {
      name: "Dr. Rajesh Sharma",
      title: "Senior Orthopedic Physiotherapist", 
      image: "/images/dr-rajesh-sharma.jpg",
      qualifications: ["MPT Orthopedics", "Orthopedic Specialist"],
      experience: "10+ Years",
      specializations: ["Orthopedic Rehabilitation", "Post-Surgical Care", "Sports Medicine"],
      rating: 4.9
    },
    {
      name: "Dr. Priya Desai",
      title: "Senior Neurological Physiotherapist",
      image: "/images/dr-priya-desai.jpg", 
      qualifications: ["MPT Neurology", "Neurological Specialist"],
      experience: "7+ Years",
      specializations: ["Neurological Rehabilitation", "Stroke Recovery", "Spinal Cord Injuries"],
      rating: 4.7
    }
  ]

  return (
    <section id="team" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-tertiary-100 text-tertiary-700 rounded-full text-sm font-semibold mb-4">
            Our Team
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display">
            Get to know the Doctor's who inspiring our team to the new heights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced and qualified team of physiotherapists dedicated to your recovery and wellness.
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Doctor Image */}
              <div className="relative mb-6">
                <div className="w-full h-64 bg-primary-100 rounded-xl flex items-center justify-center">
                  <UserIcon className="h-24 w-24 text-primary-500" />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <StarIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900 font-display">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 font-semibold">
                  {doctor.title}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(doctor.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {doctor.rating}
                  </span>
                </div>

                {/* Experience */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>{doctor.experience} Experience</span>
                </div>

                {/* Qualifications */}
                <div className="space-y-1">
                  {doctor.qualifications.slice(0, 2).map((qual, idx) => (
                    <div key={idx} className="text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1">
                      {qual}
                    </div>
                  ))}
                </div>

                {/* Specializations */}
                <div className="pt-2">
                  <p className="text-xs text-gray-600 font-medium mb-2">Specializations:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {doctor.specializations.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="text-xs bg-primary-50 text-primary-700 rounded-full px-2 py-1">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary-50 rounded-3xl p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Creating a warm and nurturing environment for your recovery.
            </h3>
            <p className="text-lg text-gray-600">
              Our team of experienced professionals is dedicated to providing the best care for your rehabilitation journey.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-gray-600">Expert Therapists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">8+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Patients Treated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Team


