'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24"></div>
      
      <section className="section-py">
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
              Terms of <span className="text-primary-500">Service</span>
            </motion.h1>
            
            <div className="text-gray-700 space-y-6 leading-relaxed">
              <p className="text-lg">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <p>
                Please read these Terms of Service carefully before using PhysioFi&apos;s services. By accessing or using our services, you agree to be bound by these terms.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Services</h2>
              <p>
                PhysioFi provides physiotherapy services including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Home visit physiotherapy</li>
                <li>Tele-consultation services</li>
                <li>Advanced therapy treatments</li>
                <li>Clinic-based services (where available)</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Appointments</h2>
              <p>
                Appointments can be scheduled through our website or by contacting us directly. We reserve the right to reschedule or cancel appointments due to unforeseen circumstances.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellation Policy</h2>
              <p>
                Please cancel or reschedule appointments at least 24 hours in advance. Late cancellations may be subject to charges.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment</h2>
              <p>
                Payment is due at the time of service unless otherwise arranged. We accept various payment methods as specified during booking.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p>
                PhysioFi provides professional physiotherapy services. While we strive for the best outcomes, individual results may vary. We are not liable for any indirect, incidental, or consequential damages.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
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



