'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  TrophyIcon, 
  CalendarDaysIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const conditionCardPalette = [
  { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
  { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600' },
  { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600' },
  { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600' },
  { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600' },
  { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600' },
]
const cardStyle = (index: number) => conditionCardPalette[index % conditionCardPalette.length]

const About = memo(() => {
  const stats = [
    { number: "70+", label: "Patients", icon: UserGroupIcon },
    { number: "2+", label: "Years Experience", icon: TrophyIcon },
    { number: "98.2%", label: "Client Satisfaction", icon: CalendarDaysIcon }
  ]

  const whyChooseUs = [
    {
      title: "Multiple therapies at one place",
      description: "We provide multiple therapies at one place, patients do not have to go anywhere once they come to us."
    },
    {
      title: "Constant Monitoring", 
      description: "We have constant monitoring process on patient overall growth and recovery progress."
    },
    {
      title: "Team of Experts",
      description: "Experience & trained therapy staff with years of expertise in physiotherapy."
    },
    {
      title: "Regular follow up",
      description: "Regular follow up with our expert consultant to track & strategise patient development."
    },
    {
      title: "Patient friendly infrastructure",
      description: "Patient friendly infrastructure, spacious, colourful, separate therapy departments, well equipped."
    },
    {
      title: "Personalised care",
      description: "Personalised care, personal therapy session, one to one therapy for better results."
    }
  ]

  return (
    <section id="about" className="py-32 section-alt relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
          >
            About PhysioFi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-display leading-tight tracking-tight"
          >
            Built for your recovery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto text-lg"
          >
            Empowering recovery, mobility, and quality of life
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const style = cardStyle(index)
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`group relative text-center ${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-6 flex flex-col overflow-hidden`}
            >
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{stat.number}</div>
              <div className="text-gray-500 font-medium text-xs uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          )})}
        </div>

        <div className="bg-primary-50 rounded-2xl p-12 mb-20 border border-primary-200/40 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-block bg-primary-50 text-primary-700 rounded-full px-5 py-2 mb-6 text-sm font-semibold"
              >
                Founder & Director
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-6 font-display text-gray-900"
              >
                Dr. Shruti Singh (PT)
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg mb-4 text-gray-700 font-medium"
              >
                A compassionate physiotherapist with a clear purpose—to make quality physiotherapy accessible to everyone.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-base mb-4 text-gray-700 font-medium"
              >
                With clinical expertise in:
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base mb-6 text-gray-700 space-y-2 list-disc list-inside"
              >
                <li>Pediatric Physiotherapy</li>
                <li>Pain Management</li>
                <li>Ortho & Sports Rehabilitation</li>
                <li>Neurological & Post-Operative Care</li>
              </motion.ul>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="text-base text-gray-700 leading-relaxed mb-6"
              >
                Dr. Shruti blends modern techniques with a patient-first approach, ensuring every treatment plan is customised, safe, and results-driven.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {['Pediatric Care', 'Sports Rehab', 'Post-Surgery Recovery', 'Neurological Care', 'Geriatric Care'].map((tag, idx) => (
                  <span key={idx} className="bg-primary-50 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-pastel-mint-50 card-hover-premium border border-primary-200/40 rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 rounded-xl bg-pastel-mint-100 flex items-center justify-center mx-auto mb-6 text-pastel-mint-600">
                <HeartIcon className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-semibold mb-3 font-display text-gray-900 tracking-tight">Hands-on leadership</h4>
              <p className="text-gray-500 leading-relaxed text-sm">
                Shruti personally oversees every patient case, ensuring personalized care that sets <span className="text-primary-600 font-medium">PhysioFi</span> apart.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 mb-16"
          >
            {[
              { icon: HeartIcon, title: "Compassionate Care", desc: "Personalized attention" },
              { icon: CheckCircleIcon, title: "Expert Team", desc: "Led by Dr. Shruti Singh" },
              { icon: UserGroupIcon, title: "Home & Online", desc: "Flexible options" },
              { icon: TrophyIcon, title: "Proven Results", desc: "70+ happy patients" }
            ].map((item, index) => {
              const style = cardStyle(index)
              return (
              <div
                key={index}
                className={`group relative ${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-6 flex flex-col text-center overflow-hidden`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                  <item.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2 font-display tracking-tight">{item.title}</h4>
                <p className="text-sm text-gray-500 flex-grow">{item.desc}</p>
              </div>
              )
            })}
          </motion.div>

        <div className="bg-pastel-blue-50 rounded-2xl border border-primary-200/40 p-12 shadow-sm">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-display tracking-tight max-w-2xl mx-auto">
              Bridging gaps so your recovery can blossom
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
              By serving patients we are building happy families which will contribute in spreading awareness
              in society & by uplifting society&apos;s attitude towards physiotherapy we are opening new windows
              for inclusion which will contribute in nation building
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((feature, index) => {
              const style = cardStyle(index)
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`group relative ${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-6 flex items-start gap-4 overflow-hidden`}
              >
                <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                  <CheckCircleIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 mb-2 font-display tracking-tight">{feature.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </section>
  )
})

About.displayName = 'About'

export default About
