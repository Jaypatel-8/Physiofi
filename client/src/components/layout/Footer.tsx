'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Tele-Consultation', href: '/services/tele-consultation' },
      { name: 'Career', href: '/career' },
      { name: 'Contact', href: '/contact' }
    ]
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/physiofi', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com/@physiofi', icon: 'youtube' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/physiofi', icon: 'linkedin' }
  ]

  return (
    <footer className="bg-white shadow-lg">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <Image
                    src="/Physiofi Logo(1).png"
                    alt="PhysioFi Logo"
                    width={120}
                    height={50}
                    className="group-hover:scale-105 transition-transform duration-300 object-contain"
                    style={{ width: 'auto', height: 'auto', maxWidth: '120px' }}
                    priority
                  />
                </div>
              </Link>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Professional physiotherapy services delivered to your doorstep across India. 
                Expert therapists, personalized care, and flexible scheduling for your recovery journey.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">+91 9082770384</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4 text-secondary-600" />
                  </div>
                  <span className="text-gray-700">contact@physiofi.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-tertiary-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-tertiary-600" />
                  </div>
                  <span className="text-gray-700">Ahmedabad, Mumbai</span>
                </div>
              </div>


              {/* Social Links */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const colors = [
                      'bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
                      'bg-red-600 hover:bg-red-700',
                      'bg-blue-600 hover:bg-blue-700'
                    ]
                    const iconPaths = {
                      instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                      youtube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
                      linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
                    }
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-12 h-12 ${colors[index]} rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}
                        aria-label={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d={iconPaths[social.icon as keyof typeof iconPaths]} />
                        </svg>
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Quick Links</h4>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Emergency Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-6"
        >
          <div className="bg-accent-50 rounded-xl p-6 text-center shadow-md">
            <p className="text-gray-700 text-sm">
              <strong className="text-accent-600">Important:</strong> PhysioFi provides physiotherapy services at home and online. 
              In emergencies, call your local emergency number (108) immediately.
            </p>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {currentYear} PhysioFi. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/privacy-policy" className="hover:text-primary-600 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-600 transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-primary-400" />
              <span>in Ahmedabad</span>
              <span className="mx-2">•</span>
              <span>Made by</span>
              <Link 
                href="https://truvixoo.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center ml-1 hover:opacity-80 transition-opacity duration-300 group"
                aria-label="Visit TruVixo website"
              >
                <Image
                  src="/TruVixo 2 (2).png"
                  alt="TruVixo Logo"
                  width={100}
                  height={30}
                  className="h-6 w-auto group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
