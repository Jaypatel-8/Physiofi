'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const conditionsList = [
  { name: 'Low Back Pain / Sciatica', href: '/conditions/low-back-pain' },
  { name: 'Neck Pain', href: '/conditions/neck-pain' },
  { name: 'Shoulder Pain', href: '/conditions/shoulder-pain' },
  { name: 'Knee Pain', href: '/conditions/knee-pain' },
  { name: 'Sports Injuries', href: '/conditions/sports-injuries' },
  { name: 'Post-Operative', href: '/conditions/post-operative' },
  { name: 'Stroke Rehabilitation', href: '/conditions/stroke-rehabilitation' },
  { name: "Parkinson's", href: '/conditions/parkinsons' },
  { name: 'Spinal Cord Injury', href: '/conditions/spinal-cord-injury' },
  { name: 'COPD / Asthma', href: '/conditions/copd-asthma' },
  { name: 'Post-COVID Recovery', href: '/conditions/post-covid' },
  { name: 'Pediatric', href: '/conditions/pediatric-developmental' },
  { name: 'Torticollis', href: '/conditions/torticollis' },
  { name: 'Balance (Geriatric)', href: '/conditions/balance-problems' },
  { name: 'Osteoporosis', href: '/conditions/osteoporosis' },
  { name: 'Pregnancy Pain', href: '/conditions/pregnancy-pain' },
  { name: 'Urinary Incontinence', href: '/conditions/urinary-incontinence' },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    explore: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Conditions We Treat', href: '/conditions' },
      { name: 'Contact', href: '/contact' },
      { name: 'Career', href: '/career' },
    ],
    services: [
      { name: 'Home Visit', href: '/services/home-visit' },
      { name: 'Tele-Consultation', href: '/services/tele-consultation' },
      { name: 'Advanced Therapies', href: '/services/advanced-therapies' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/physiofi', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com/@physiofi', icon: 'youtube' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/physiofi', icon: 'linkedin' },
  ]

  const iconPaths: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    youtube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  }

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom">
        <div className="py-10 sm:py-12 lg:py-16">
          {/* Top: logo + tagline + contact + social */}
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-8 sm:pb-10 lg:pb-12 border-b border-white/15">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block mb-4">
                <span className="inline-block [filter:brightness(0)_invert(1)]">
                  <Image
                    src="/Physiofi Logo(1).png"
                    alt="PhysioFi Logo"
                    width={140}
                    height={56}
                    className="object-contain"
                    style={{ maxWidth: '140px', height: 'auto' }}
                    priority
                  />
                </span>
              </Link>
              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                Professional physiotherapy at your doorstep across India. Expert therapists, personalized care.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <PhoneIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <a href="tel:+919082770384" className="text-white font-medium text-sm hover:text-white/90 transition-colors">+91 9082770384</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <EnvelopeIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <a href="mailto:contact@physiofi.com" className="text-white font-medium text-sm hover:text-white/90 transition-colors">contact@physiofi.com</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <MapPinIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-white/90 text-sm">Ahmedabad, Mumbai</span>
              </div>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={iconPaths[social.icon]} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links grid: Explore, Services, Conditions, Legal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pt-8 lg:pt-10">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">Explore</h4>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">Conditions We Treat</h4>
              <ul className="space-y-1.5 columns-2 gap-x-6 text-sm">
                {conditionsList.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white font-medium transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency note */}
          <div className="mt-10 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center">
            <p className="text-white/90 text-xs">
              <strong className="text-white">Important:</strong> PhysioFi provides physiotherapy at home and online. In emergencies, call 108 immediately.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-white/70 text-sm">
              © {currentYear} PhysioFi. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>Made by</span>
              <Link
                href="https://truvixoo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/90 font-medium transition-colors"
                aria-label="TruVixo"
              >
                TruVixo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
