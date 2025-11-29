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

  const colorClasses = {
    primary: { bg: 'bg-primary-50', iconBg: 'bg-primary-300' },
    'pastel-blue': { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-300' },
    'pastel-mint': { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-300' },
    'pastel-peach': { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-300' }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-4 font-display">
            Why Choose PhysioFi?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Expert physiotherapy care delivered right at your home or online
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const color = colorClasses[reason.color as keyof typeof colorClasses]
            const isRightSide = index % 4 === 3 || (index % 4 === 2 && index >= 4)
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${color.bg} rounded-3xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col ${
                  isRightSide ? 'rounded-tr-[50px] rounded-br-[50px]' : ''
                }`}
              >
                {/* Book Corner Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-gray-200 opacity-60"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-gray-100 opacity-80"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-16 h-16 ${color.iconBg} rounded-2xl flex items-center justify-center mb-5 shadow-xl`}>
                    <reason.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 font-display">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection





