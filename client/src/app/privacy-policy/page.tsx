'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24"></div>
      
      <section className="py-20">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 font-display"
            >
              Privacy <span className="text-primary-500">Policy</span>
            </motion.h1>
            
            <div className="text-gray-700 space-y-6 leading-relaxed">
              <p className="text-lg">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <p>
                At PhysioFi, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, email, phone number, address)</li>
                <li>Medical information relevant to your treatment</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Appointment history and preferences</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our physiotherapy services</li>
                <li>Schedule and manage appointments</li>
                <li>Communicate with you about your treatment</li>
                <li>Process payments and send invoices</li>
                <li>Send important updates and notifications</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> contact@physiofi.com<br />
                <strong>Phone:</strong> +91 9082770384
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}



