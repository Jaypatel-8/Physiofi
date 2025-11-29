'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid'
import { ChatBubbleLeftRightIcon as QuoteIcon } from '@heroicons/react/24/outline'

const TestimonialDot = ({ index, isActive, onClick }: { index: number; isActive: boolean; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  return (
    <button
      data-dot-index={index}
      onClick={onClick}
      className={`h-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-primary-400 w-8'
          : 'bg-gray-300 w-2 hover:bg-gray-400'
      }`}
    />
  )
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Patel',
      text: 'it\'s a very amazing experience to work with PhysioFi.. i explore my knowledge and skills.. One must try to bring their special need to here for such a satisfying treatment with a good quality..',
      rating: 5
    },
    {
      id: 2,
      name: 'Sunita Sharma',
      text: 'PhysioFi is one of the best center in India for physiotherapy. PhysioFi is best for both physiotherapy and occupational therapy… PhysioFi provides best treatment to the patients.',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Kumar',
      text: 'Best physiotherapy center… Providing good quality of treatment … Helping patients to live a independent life… Supporting staff and the best environment for the patient to grow up and become independent with great consultation.',
      rating: 5
    },
    {
      id: 4,
      name: 'Meera Desai',
      text: 'PhysioFi is great place to work. Nice infrastructure, well furnished and high quality staff. PhysioFi is one stop solution provider for all kind of physical disabilities with advance therapies there is provided best treatment as well as best consulting to their patients.',
      rating: 5
    },
    {
      id: 5,
      name: 'Vikram Singh',
      text: 'My 3 years old Son was suffering majorly from sensory problem. I have started physiotherapy at PhysioFi in March month 2023. After 2 years I can see noticeable changes in my son.',
      rating: 5
    },
    {
      id: 6,
      name: 'Priya Agarwal',
      text: 'My child having Delay speech issue we are started physiotherapy at the PhysioFi before 7 month now my son started speak still we continue the therapy we really thankful to Dr Arth Patel and Dr Prakruti Patel.',
      rating: 5
    },
    {
      id: 7,
      name: 'Rahul Purohit',
      text: 'PhysioFi is the best physiotherapy center for patient to recover. My child is now completely fine and I m completely satisfy as we got good guidance related to condition of my child and complete recovery..thanks to Dr Arth Patel and there staff for helping us …',
      rating: 5
    },
    {
      id: 8,
      name: 'Priti Pandey',
      text: 'PhysioFi is best … Really admire our transparent nature, Dr Arth & Dr Prakruti guided me completely, my son having ASD. I came from Banaras for therapy here in PhysioFi, after ten session only my kid showing improvement, they have great team of therapist, nice management. All facilities under one roof. Thanks for their support.',
      rating: 5
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= testimonials.length) {
        return 0
      }
      return next
    })
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1
      if (prevIndex < 0) {
        return testimonials.length - 1
      }
      return prevIndex
    })
  }

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1
          if (next >= testimonials.length) {
            return 0
          }
          return next
        })
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, testimonials.length])

  const handlePrevTestimonial = () => {
    prevTestimonial()
    setIsAutoPlaying(false)
  }

  const handleNextTestimonial = () => {
    nextTestimonial()
    setIsAutoPlaying(false)
  }

  const handleStopAutoPlay = () => {
    setIsAutoPlaying(false)
  }

  const handleDotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(e.currentTarget.getAttribute('data-dot-index'))
    if (!isNaN(index)) {
      setCurrentIndex(index)
      setIsAutoPlaying(false)
    }
  }

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-6 w-6 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header - Modern Typography */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="bg-pastel-peach-100 text-pastel-peach-400 px-5 py-2 rounded-full text-sm font-semibold">
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
            What Our Clients Say
            <span className="block text-pastel-sky-400">About Us</span>
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

        {/* Testimonial Carousel - Book Design */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl p-10 shadow-2xl relative overflow-hidden">
            {/* Book Corner Effect */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-gray-200 opacity-50"></div>
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[55px] border-l-transparent border-t-[55px] border-t-gray-100 opacity-70"></div>
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-white opacity-90"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center relative z-10"
              >
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <QuoteIcon className="h-8 w-8 text-primary-700" />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto font-light">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Patient Info */}
                  <div className="bg-primary-50 rounded-2xl p-6 max-w-xl mx-auto shadow-lg relative overflow-hidden">
                  {/* Book Corner Effect */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary-200 opacity-60"></div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-primary-100 opacity-80"></div>
                  
                  <div className="flex items-center justify-center space-x-6 mb-4 relative z-10">
                    <div className="w-20 h-20 bg-secondary-300 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-xl">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-gray-900 text-xl font-display">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-gray-600 font-medium">
                        Patient
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex justify-center relative z-10">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevTestimonial}
            onMouseEnter={handleStopAutoPlay}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-10"
          >
                    <ChevronLeftIcon className="h-7 w-7 text-tertiary-500" />
          </button>
          
          <button
            onClick={handleNextTestimonial}
            onMouseEnter={handleStopAutoPlay}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-10"
          >
                    <ChevronRightIcon className="h-7 w-7 text-primary-500" />
          </button>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mt-10">
          {testimonials.map((_, index) => (
            <TestimonialDot
              key={index}
              index={index}
              isActive={index === currentIndex}
              onClick={handleDotClick}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleToggleAutoPlay}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-500 transition-colors duration-300"
          >
                    <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? 'bg-primary-400' : 'bg-gray-300'}`} />
            <span className="font-medium">{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
