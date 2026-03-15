'use client'

import { motion } from 'framer-motion'
import { ShieldCheckIcon, UserIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline'

const WhyChooseSection = () => {
  const reasons = [
    {
      icon: ShieldCheckIcon,
      title: "Certified Experts",
      description: "Licensed and experienced physiotherapists",
      color: "primary"
    },
    {
      icon: UserIcon,
      title: "Personalized Care",
      description: "Tailored treatment plans for your specific needs",
      color: "pastel-blue"
    },
    {
      icon: ClockIcon,
      title: "Flexible Scheduling",
      description: "Book appointments that fit your schedule",
      color: "pastel-mint"
    },
    {
      icon: HeartIcon,
      title: "Compassionate Approach",
      description: "Caring support throughout your recovery journey",
      color: "pastel-peach"
    }
  ]

  const cardBg = ['bg-card-1', 'bg-card-2', 'bg-card-3', 'bg-card-1']

  return (
    <section className="py-16 bg-pastel-mesh">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-4">Why choose us</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
            Why Choose PhysioFi?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Expert care at your home or online
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`card-hover-premium rounded-2xl p-6 h-full flex flex-col ${cardBg[index]}`}
            >
              <div className="icon-pastel w-14 h-14 mb-5">
                <reason.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg site-card-title mb-3 font-display tracking-tight">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection





