'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      details: ["+91 9082770384"],
      description: "Call us for immediate assistance",
      color: "primary"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["contact@physiofi.com"],
      description: "Send us an email anytime",
      color: "secondary"
    },
    {
      icon: MapPinIcon,
      title: "Locations",
      details: ["Ahmedabad", "Mumbai"],
      description: "We serve in these cities",
      color: "tertiary"
    },
    {
      icon: ClockIcon,
      title: "Hours",
      details: ["Mon-Sat: 8AM-8PM", "Sunday: 9AM-6PM", "Emergency: 24/7"],
      description: "We're here when you need us",
      color: "accent"
    }
  ]

  const colorClasses = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-700', iconBg: 'bg-primary-300' },
    secondary: { bg: 'bg-pastel-blue-50', text: 'text-pastel-blue-400', iconBg: 'bg-pastel-blue-300' },
    tertiary: { bg: 'bg-pastel-mint-50', text: 'text-pastel-mint-400', iconBg: 'bg-pastel-mint-300' },
    accent: { bg: 'bg-pastel-lavender-50', text: 'text-pastel-lavender-400', iconBg: 'bg-pastel-lavender-300' }
  }

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header - Modern Typography */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="bg-pastel-sage-100 text-pastel-sage-400 px-5 py-2 rounded-full text-sm font-semibold">
              Contact Us
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
          >
            Get In Touch
            <span className="block"><span className="text-primary-500">With</span> <span className="text-primary-500">Us</span> <span className="text-primary-500">Today</span></span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-xl mx-auto font-light"
          >
            Have questions about our services? Need to book an appointment? We're here to help you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Information - Book Design */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 font-display">
                Contact Information
              </h3>
              <p className="text-lg text-gray-600 mb-8 font-light">
                Get in touch with us through any of the following methods. We're always ready to help you with your physiotherapy needs.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const color = colorClasses[info.color as keyof typeof colorClasses]
                const isRightSide = index % 2 === 1
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`flex items-start space-x-5 ${color.bg} rounded-3xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                      isRightSide ? 'rounded-tr-[50px] rounded-br-[50px]' : ''
                    }`}
                  >
                    {/* Book Corner Effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-gray-200 opacity-60"></div>
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-gray-100 opacity-80"></div>
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-white opacity-90"></div>
                    
                    <div className={`w-16 h-16 ${color.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative z-10`}>
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="relative z-10 flex-grow">
                      <h4 className="text-xl font-black text-gray-900 mb-3 font-display">{info.title}</h4>
                      <div className="space-y-1 mb-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 font-light">{info.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Emergency Contact - Book Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pastel-peach-50 to-pastel-sage-50 rounded-tl-[40px] rounded-br-[40px] rounded-tr-2xl rounded-bl-2xl p-8 shadow-xl relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-pastel-peach-200 opacity-60"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-pastel-peach-100 opacity-80"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-white opacity-90"></div>
              
              <div className="flex items-center space-x-4 mb-4 relative z-10">
                <div className="w-14 h-14 bg-pastel-peach-300 rounded-xl flex items-center justify-center shadow-lg">
                  <PhoneIcon className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-black text-gray-900 text-xl font-display">Emergency Contact</h4>
              </div>
              <p className="text-gray-900 font-black text-2xl mb-2 relative z-10">+91 9082770384</p>
              <p className="text-gray-700 font-medium relative z-10">Available 24/7 for emergency physiotherapy needs</p>
            </motion.div>
          </motion.div>

          {/* Contact Form - Book Design */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Book Corner Effect */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-gray-200 opacity-50"></div>
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[55px] border-l-transparent border-t-[55px] border-t-gray-100 opacity-70"></div>
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-white opacity-90"></div>
            
            <h3 className="text-3xl font-black text-gray-900 mb-8 font-display relative z-10">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300 text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300 text-lg"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300 text-lg"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-lg resize-none"
                  placeholder="Tell us about your needs or ask any questions..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-300 text-white font-black text-lg py-5 rounded-xl hover:bg-primary-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 text-center relative z-10">
              <p className="text-sm text-gray-500 font-medium">
                We'll get back to you within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
