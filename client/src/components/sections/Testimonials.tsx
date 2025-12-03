'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Patel',
      text: 'It\'s a very amazing experience to work with PhysioFi. I explore my knowledge and skills. One must try to bring their special need to here for such a satisfying treatment with a good quality.',
      location: 'Ahmedabad'
    },
    {
      id: 2,
      name: 'Sunita Sharma',
      text: 'PhysioFi is one of the best center in India for physiotherapy. PhysioFi is best for both physiotherapy and occupational therapy. PhysioFi provides best treatment to the patients.',
      location: 'Navi Mumbai'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      text: 'Best physiotherapy center. Providing good quality of treatment. Helping patients to live an independent life. Supporting staff and the best environment for the patient to grow up.',
      location: 'Ahmedabad'
    },
    {
      id: 4,
      name: 'Meera Desai',
      text: 'PhysioFi is great place to work. Nice infrastructure, well furnished and high quality staff. PhysioFi is one stop solution provider for all kind of physical disabilities.',
      location: 'Ahmedabad'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      text: 'My 3 years old Son was suffering majorly from sensory problem. I have started physiotherapy at PhysioFi in March month 2023. After 2 years I can see noticeable changes in my son.',
      location: 'Ahmedabad'
    },
    {
      id: 6,
      name: 'Priya Agarwal',
      text: 'My child having Delay speech issue we are started physiotherapy at the PhysioFi before 7 month now my son started speak still we continue the therapy we really thankful to Dr Arth Patel and Dr Prakruti Patel.',
      location: 'Ahmedabad'
    },
    {
      id: 7,
      name: 'Rahul Purohit',
      text: 'PhysioFi is the best physiotherapy center for patient to recover. My child is now completely fine and I m completely satisfy as we got good guidance related to condition of my child and complete recovery.',
      location: 'Ahmedabad'
    },
    {
      id: 8,
      name: 'Priti Pandey',
      text: 'PhysioFi is best. Really admire our transparent nature, Dr Arth & Dr Prakruti guided me completely, my son having ASD. I came from Banaras for therapy here in PhysioFi, after ten session only my kid showing improvement.',
      location: 'Ahmedabad'
    }
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextTestimonial()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, currentIndex])

  const handlePrevTestimonial = () => {
    prevTestimonial()
    setIsAutoPlaying(false)
  }

  const handleNextTestimonial = () => {
    nextTestimonial()
    setIsAutoPlaying(false)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
              Testimonials
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
          >
            What Our <span className="text-primary-500">Clients</span> Say
            <span className="block">About <span className="text-primary-500">Us</span></span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-xl mx-auto font-light"
          >
            Hear from our satisfied patients who have experienced exceptional physiotherapy care
          </motion.p>
        </div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-100 relative overflow-hidden">
            {/* Quote icon decoration */}
            <div className="absolute top-6 right-6 opacity-5">
              <ChatBubbleLeftRightIcon className="h-24 w-24 text-primary-500" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center relative z-10"
              >
                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto font-medium">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Patient Info */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {getInitials(testimonials[currentIndex].name)}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-xl font-display mb-1">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <UserCircleIcon className="h-4 w-4" />
                      <span>{testimonials[currentIndex].location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevTestimonial}
            onMouseEnter={() => setIsAutoPlaying(false)}
            className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-primary-50 transition-all duration-300 z-10 border-2 border-gray-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="h-6 w-6 md:h-7 md:w-7 text-primary-600" />
          </button>
          
          <button
            onClick={handleNextTestimonial}
            onMouseEnter={() => setIsAutoPlaying(false)}
            className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-primary-50 transition-all duration-300 z-10 border-2 border-gray-100"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="h-6 w-6 md:h-7 md:w-7 text-primary-600" />
          </button>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-300"
          >
            <div className={`w-3 h-3 rounded-full transition-colors ${
              isAutoPlaying ? 'bg-primary-500' : 'bg-gray-300'
            }`} />
            <span className="font-medium">{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </button>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">100+</div>
              <div className="text-white/90 font-medium">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">5.0</div>
              <div className="text-white/90 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
              <div className="text-white/90 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">2+</div>
              <div className="text-white/90 font-medium">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
