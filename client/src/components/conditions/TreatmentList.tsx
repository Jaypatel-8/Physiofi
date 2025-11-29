'use client'

import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  WrenchScrewdriverIcon,
  BoltIcon,
  FireIcon,
  ArrowPathIcon,
  CpuChipIcon,
  CloudIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  CheckCircleIcon,
  BeakerIcon,
  AcademicCapIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

interface TreatmentListProps {
  treatments: string[]
  title?: string
  treatmentIcons?: React.ComponentType<{ className?: string }>[]
}

const getDefaultIcon = (treatment: string, index: number): React.ComponentType<{ className?: string }> => {
  const lower = treatment.toLowerCase()
  
  // Match icons based on treatment keywords
  if (lower.includes('breathing') || lower.includes('pulmonary') || lower.includes('chest')) {
    return CloudIcon
  }
  if (lower.includes('strength') || lower.includes('strengthening') || lower.includes('conditioning')) {
    return BoltIcon
  }
  if (lower.includes('balance') || lower.includes('gait') || lower.includes('walking')) {
    return ArrowPathIcon
  }
  if (lower.includes('mobility') || lower.includes('movement') || lower.includes('flexibility')) {
    return ArrowTrendingUpIcon
  }
  if (lower.includes('posture') || lower.includes('postural')) {
    return BuildingLibraryIcon
  }
  if (lower.includes('pain') || lower.includes('relief')) {
    return HeartIcon
  }
  if (lower.includes('neuro') || lower.includes('neurological') || lower.includes('stroke')) {
    return CpuChipIcon
  }
  if (lower.includes('pediatric') || lower.includes('child') || lower.includes('play')) {
    return UserCircleIcon
  }
  if (lower.includes('pelvic') || lower.includes('bladder')) {
    return SparklesIcon
  }
  if (lower.includes('sport') || lower.includes('injury') || lower.includes('rehab')) {
    return FireIcon
  }
  if (lower.includes('manual') || lower.includes('therapy') || lower.includes('technique')) {
    return WrenchScrewdriverIcon
  }
  if (lower.includes('exercise') || lower.includes('training') || lower.includes('program')) {
    return AcademicCapIcon
  }
  if (lower.includes('home') || lower.includes('functional')) {
    return HomeIcon
  }
  
  // Default icons based on index
  const defaultIcons = [HeartIcon, BoltIcon, CheckCircleIcon, SparklesIcon]
  return defaultIcons[index % defaultIcons.length]
}

const TreatmentList = ({ treatments, title = "How We Help", treatmentIcons }: TreatmentListProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-pastel-sage-50 via-pastel-peach-50 to-pastel-lavender-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-8 font-display text-center">
            {title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {treatments.map((treatment, index) => {
              const IconComponent = treatmentIcons?.[index] || getDefaultIcon(treatment, index)
              const colors = [
                'bg-primary-300',
                'bg-pastel-blue-300',
                'bg-pastel-mint-300',
                'bg-pastel-lavender-300',
                'bg-pastel-peach-300',
                'bg-pastel-sage-300'
              ]
              const bgColor = colors[index % colors.length]
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex items-start space-x-4"
                >
                  <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative z-10`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg pt-2 relative z-10">{treatment}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TreatmentList

