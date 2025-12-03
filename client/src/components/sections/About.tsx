'use client'

import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  TrophyIcon, 
  CalendarDaysIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const About = () => {
  const stats = [
    { number: "70+", label: "Patients", icon: UserGroupIcon, color: "primary" },
    { number: "2+", label: "Years Experience", icon: TrophyIcon, color: "secondary" },
    { number: "100%", label: "Client Satisfaction", icon: CalendarDaysIcon, color: "tertiary" }
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
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header - Modern Typography */}
        <div className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="bg-pastel-lavender-100 text-pastel-lavender-400 px-5 py-2 rounded-full text-sm font-semibold">
              About <span className="text-primary-500">PhysioFi</span>
            </span>
        </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
          >
            We Are The Best
            <span className="block text-pastel-mint-400">For Your Recovery</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Empowering recovery, restoring mobility, improving quality of life
          </motion.p>
        </div>

        {/* Stats Section - Smaller Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const colorClasses = {
              primary: { bg: 'bg-primary-50', text: 'text-primary-700', iconBg: 'bg-primary-100 border-primary-300' },
              secondary: { bg: 'bg-pastel-blue-50', text: 'text-pastel-blue-400', iconBg: 'bg-pastel-blue-100 border-pastel-blue-300' },
              tertiary: { bg: 'bg-pastel-mint-50', text: 'text-pastel-mint-400', iconBg: 'bg-pastel-mint-100 border-pastel-mint-300' }
            }
            const color = colorClasses[stat.color as keyof typeof colorClasses]
            
            return (
              <motion.div
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`text-center ${color.bg} rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col`}
              >
                <div className={`w-12 h-12 ${color.iconBg} border-2 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`h-6 w-6 ${color.text}`} />
                </div>
                <div className={`text-2xl font-black mb-2 ${color.text}`}>{stat.number}</div>
                <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Founder Section - Rounded Design with Mild Colors */}
        <div className="bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sky-50 rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl p-12 mb-16 border border-primary-100/50 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-block bg-primary-100/60 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              >
                <span className="text-base font-bold text-primary-800">👑 Founder & Director</span>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black mb-6 font-display text-gray-900"
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
                className="flex flex-wrap gap-3"
              >
                {['Pediatric Care', 'Sports Rehab', 'Post-Surgery Recovery', 'Neurological Care', 'Geriatric Care'].map((tag, idx) => (
                  <span key={idx} className="bg-primary-100/60 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold text-primary-800">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center relative overflow-hidden border border-primary-100/50 shadow-md"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100/40"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50/60"></div>
              
              <div className="w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl relative z-10">
                <HeartIcon className="h-20 w-20 text-primary-600" />
              </div>
              <h4 className="text-3xl font-black mb-4 font-display relative z-10 text-gray-900">Hands-On Leadership</h4>
              <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                Shruti personally oversees every patient case, ensuring personalized care and attention to detail that sets <span className="text-primary-600 font-semibold">PhysioFi</span> apart.
              </p>
        </motion.div>
          </div>
        </div>

        {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 mb-16"
          >
            {[
              { icon: HeartIcon, title: "Compassionate Care", desc: "Personalized attention", bg: "bg-primary-50", text: "text-primary-700", iconBg: "bg-primary-100 border-primary-300" },
            { icon: CheckCircleIcon, title: "Expert Team", desc: "Led by Dr. Shruti Singh", bg: "bg-pastel-lavender-50", text: "text-pastel-lavender-400", iconBg: "bg-pastel-lavender-100 border-pastel-lavender-300" },
              { icon: UserGroupIcon, title: "Home & Online", desc: "Flexible options", bg: "bg-pastel-peach-50", text: "text-pastel-peach-400", iconBg: "bg-pastel-peach-100 border-pastel-peach-300" },
              { icon: TrophyIcon, title: "Proven Results", desc: "70+ happy patients", bg: "bg-pastel-sage-50", text: "text-pastel-sage-400", iconBg: "bg-pastel-sage-100 border-pastel-sage-300" }
            ].map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${item.bg} rounded-xl p-6 h-full text-center shadow-md hover:shadow-lg transition-all duration-300 flex flex-col`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 ${item.iconBg} border-2 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <item.icon className={`h-7 w-7 ${item.text}`} />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-3 font-display">{item.title}</h4>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed flex-grow">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>

        {/* Why Choose Us Section - Book Design */}
        <div className="bg-gradient-to-br from-pastel-sky-50 via-pastel-peach-50 to-pastel-sage-50 rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-gray-900 mb-4 font-display">
              By Bridging Gaps We Make Sure Your <span className="text-primary-500">Recovery</span> Will <span className="text-primary-500">Blossom</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              By serving patients we are building happy families which will contribute in spreading awareness 
              in society & by uplifting society's attitude towards physiotherapy we are opening new windows 
              for inclusion which will contribute in nation building
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((feature, index) => {
              const colors = [
                { bg: 'bg-primary-50', text: 'text-primary-700', iconBg: 'bg-primary-100 border-primary-300' },
                { bg: 'bg-pastel-blue-50', text: 'text-pastel-blue-400', iconBg: 'bg-pastel-blue-100 border-pastel-blue-300' },
                { bg: 'bg-pastel-mint-50', text: 'text-pastel-mint-400', iconBg: 'bg-pastel-mint-100 border-pastel-mint-300' },
                { bg: 'bg-pastel-lavender-50', text: 'text-pastel-lavender-400', iconBg: 'bg-pastel-lavender-100 border-pastel-lavender-300' },
                { bg: 'bg-pastel-peach-50', text: 'text-pastel-peach-400', iconBg: 'bg-pastel-peach-100 border-pastel-peach-300' },
                { bg: 'bg-pastel-sage-50', text: 'text-pastel-sage-400', iconBg: 'bg-pastel-sage-100 border-pastel-sage-300' }
              ]
              const color = colors[index % colors.length]
              
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${color.bg} rounded-xl p-6 h-full shadow-md transition-all duration-300 hover:shadow-lg flex flex-col`}
                >
                  <div className="flex items-start space-x-4 flex-grow">
                    <div className={`w-14 h-14 ${color.iconBg} border-2 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CheckCircleIcon className={`h-7 w-7 ${color.text}`} />
                  </div>
                    <div className="flex-grow">
                      <h4 className={`text-lg font-black ${color.text} mb-3 font-display`}>{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
