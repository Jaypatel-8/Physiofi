'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import LocationAutocomplete from '@/components/ui/LocationAutocomplete'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'patient'
  const [registerType, setRegisterType] = useState<'patient' | 'doctor'>(type as 'patient' | 'doctor')
  
  // Patient form data
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    address: ''
  })

  // Doctor form data
  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: [] as string[],
    experience: '',
    license: '',
    bpt: {
      degree: 'BPT',
      institution: '',
      year: ''
    },
    mpt: {
      degree: 'MPT',
      institution: '',
      year: ''
    },
    hasMPT: false,
    occupation: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    bio: ''
  })

  const [specializationInput, setSpecializationInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlType = searchParams.get('type')
    if (urlType === 'patient' || urlType === 'doctor') {
      setRegisterType(urlType as 'patient' | 'doctor')
    }
  }, [searchParams])

  // Auto-save draft to localStorage
  useEffect(() => {
    if (registerType === 'patient') {
      const draft = localStorage.getItem('patient_registration_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setPatientFormData(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.error('Error loading draft:', e)
        }
      }
    } else {
      const draft = localStorage.getItem('doctor_registration_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setDoctorFormData(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.error('Error loading draft:', e)
        }
      }
    }
  }, [registerType])

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {}
    
    if (registerType === 'patient') {
      if (patientFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientFormData.email)) {
        errors.email = 'Invalid email format'
      }
      if (patientFormData.phone && !/^[0-9]{10}$/.test(patientFormData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Phone must be 10 digits'
      }
      if (patientFormData.password && patientFormData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      if (patientFormData.password && patientFormData.confirmPassword && patientFormData.password !== patientFormData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    } else {
      if (doctorFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctorFormData.email)) {
        errors.email = 'Invalid email format'
      }
      if (doctorFormData.phone && !/^[0-9]{10}$/.test(doctorFormData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Phone must be 10 digits'
      }
      if (doctorFormData.password && doctorFormData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      if (doctorFormData.password && doctorFormData.confirmPassword && doctorFormData.password !== doctorFormData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setValidationErrors(errors)
  }, [registerType, patientFormData, doctorFormData])

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (registerType === 'patient') {
        const hasData = Object.values(patientFormData).some(v => v !== '')
        if (hasData) {
          localStorage.setItem('patient_registration_draft', JSON.stringify(patientFormData))
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus(null), 2000)
        }
      } else {
        const hasData = Object.values(doctorFormData).some(v => {
          if (typeof v === 'object' && v !== null) {
            return Object.values(v).some(subV => subV !== '')
          }
          return v !== '' && v !== 0
        })
        if (hasData) {
          localStorage.setItem('doctor_registration_draft', JSON.stringify(doctorFormData))
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus(null), 2000)
        }
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [registerType, patientFormData, doctorFormData])

  const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setDoctorFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else if (name.startsWith('bpt.') || name.startsWith('mpt.')) {
      const [qualType, field] = name.split('.')
      setDoctorFormData(prev => ({
        ...prev,
        [qualType]: {
          ...prev[qualType as 'bpt' | 'mpt'],
          [field]: value
        }
      }))
    } else {
      setDoctorFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
  }

  const addSpecialization = () => {
    if (specializationInput.trim() && !doctorFormData.specialization.includes(specializationInput.trim())) {
      setDoctorFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, specializationInput.trim()]
      }))
      setSpecializationInput('')
    }
  }

  const removeSpecialization = (index: number) => {
    setDoctorFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index)
    }))
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (patientFormData.password !== patientFormData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (patientFormData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.patientRegister({
        name: patientFormData.name,
        email: patientFormData.email,
        phone: patientFormData.phone,
        password: patientFormData.password,
        age: parseInt(patientFormData.age),
        gender: patientFormData.gender,
        address: patientFormData.address
      })

      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        router.push('/login?type=patient')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      setIsLoading(false)
    }
  }

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (doctorFormData.password !== doctorFormData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (doctorFormData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (doctorFormData.specialization.length === 0) {
      setError('Please add at least one specialization')
      return
    }

    if (!doctorFormData.license) {
      setError('License number is required')
      return
    }

    setIsLoading(true)

    try {
      const qualifications = [
        {
          degree: doctorFormData.bpt.degree,
          institution: doctorFormData.bpt.institution,
          year: doctorFormData.bpt.year ? parseInt(doctorFormData.bpt.year) : undefined
        }
      ]

      if (doctorFormData.hasMPT && doctorFormData.mpt.institution) {
        qualifications.push({
          degree: doctorFormData.mpt.degree,
          institution: doctorFormData.mpt.institution,
          year: doctorFormData.mpt.year ? parseInt(doctorFormData.mpt.year) : undefined
        })
      }

      const response = await authAPI.doctorRegister({
        name: doctorFormData.name,
        email: doctorFormData.email,
        phone: doctorFormData.phone,
        password: doctorFormData.password,
        specialization: doctorFormData.specialization,
        qualifications: qualifications,
        experience: parseInt(doctorFormData.experience) || 0,
        license: doctorFormData.license,
        address: doctorFormData.address,
        bio: doctorFormData.bio
      })

      if (response.data.success) {
        toast.success('Registration successful! Awaiting admin approval.')
        router.push('/login?type=doctor')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {registerType === 'patient' ? (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-8 w-8 text-blue-600" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {registerType === 'patient' ? 'Patient Registration' : 'Doctor Registration'}
              </h1>
              <p className="text-gray-600">Create your {registerType} account</p>
            </div>

            {/* Registration Type Selector */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  setRegisterType('patient')
                  setError('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  registerType === 'patient'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegisterType('doctor')
                  setError('')
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  registerType === 'doctor'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Doctor
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {registerType === 'patient' ? (
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={patientFormData.name}
                      onChange={handlePatientInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={patientFormData.email}
                      onChange={handlePatientInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={patientFormData.phone}
                      onChange={handlePatientInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={patientFormData.age}
                      onChange={handlePatientInputChange}
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={patientFormData.gender}
                      onChange={handlePatientInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={patientFormData.password}
                        onChange={handlePatientInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={patientFormData.confirmPassword}
                        onChange={handlePatientInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <LocationAutocomplete
                    onLocationSelect={(location) => {
                      setPatientFormData(prev => ({
                        ...prev,
                        address: `${location.street}, ${location.city}, ${location.state} ${location.pincode}`.trim()
                      }))
                    }}
                    initialValue={{}}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Patient Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleDoctorSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="doctor-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="doctor-name"
                        name="name"
                        value={doctorFormData.name}
                        onChange={handleDoctorInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dr. Full Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="doctor-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Professional Email *
                      </label>
                      <input
                        type="email"
                        id="doctor-email"
                        name="email"
                        value={doctorFormData.email}
                        onChange={handleDoctorInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="professional@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="doctor-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="doctor-phone"
                        name="phone"
                        value={doctorFormData.phone}
                        onChange={handleDoctorInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2">
                        Occupation/Title *
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={doctorFormData.occupation}
                        onChange={handleDoctorInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Senior Physiotherapist, Consultant"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={doctorFormData.experience}
                        onChange={handleDoctorInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter years of experience"
                      />
                    </div>

                    <div>
                      <label htmlFor="license" className="block text-sm font-semibold text-gray-700 mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        id="license"
                        name="license"
                        value={doctorFormData.license}
                        onChange={handleDoctorInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your license number"
                      />
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Qualifications</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          BPT Institution *
                        </label>
                        <input
                          type="text"
                          name="bpt.institution"
                          value={doctorFormData.bpt.institution}
                          onChange={handleDoctorInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Institution name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          BPT Year *
                        </label>
                        <input
                          type="number"
                          name="bpt.year"
                          value={doctorFormData.bpt.year}
                          onChange={handleDoctorInputChange}
                          required
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Year"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="hasMPT"
                        checked={doctorFormData.hasMPT}
                        onChange={(e) => setDoctorFormData(prev => ({ ...prev, hasMPT: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="hasMPT" className="text-sm font-semibold text-gray-700">
                        I have MPT (Master of Physiotherapy)
                      </label>
                    </div>

                    {doctorFormData.hasMPT && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            MPT Institution
                          </label>
                          <input
                            type="text"
                            name="mpt.institution"
                            value={doctorFormData.mpt.institution}
                            onChange={handleDoctorInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Institution name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            MPT Year
                          </label>
                          <input
                            type="number"
                            name="mpt.year"
                            value={doctorFormData.mpt.year}
                            onChange={handleDoctorInputChange}
                            min="1950"
                            max={new Date().getFullYear()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Year"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialization */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Specialization *</h3>
                  <div className="space-y-3">
                    <select
                      value={specializationInput}
                      onChange={(e) => {
                        if (e.target.value && !doctorFormData.specialization.includes(e.target.value)) {
                          setDoctorFormData(prev => ({
                            ...prev,
                            specialization: [...prev.specialization, e.target.value]
                          }))
                        }
                        setSpecializationInput('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a specialization</option>
                      <option value="Orthopedic Physiotherapy">Orthopedic Physiotherapy</option>
                      <option value="Neurological Physiotherapy">Neurological Physiotherapy</option>
                      <option value="Cardiopulmonary Physiotherapy">Cardiopulmonary Physiotherapy</option>
                      <option value="Sports Physiotherapy">Sports Physiotherapy</option>
                      <option value="Pediatric Physiotherapy">Pediatric Physiotherapy</option>
                      <option value="Geriatric Physiotherapy">Geriatric Physiotherapy</option>
                      <option value="Women's Health Physiotherapy">Women's Health Physiotherapy</option>
                      <option value="Musculoskeletal Physiotherapy">Musculoskeletal Physiotherapy</option>
                      <option value="Post-Surgical Rehabilitation">Post-Surgical Rehabilitation</option>
                      <option value="Pain Management">Pain Management</option>
                      <option value="Balance and Vestibular Rehabilitation">Balance and Vestibular Rehabilitation</option>
                      <option value="Ergonomic Assessment">Ergonomic Assessment</option>
                    </select>
                    {doctorFormData.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {doctorFormData.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              className="hover:text-blue-900"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
                  <LocationAutocomplete
                    onLocationSelect={(location) => {
                      setDoctorFormData(prev => ({
                        ...prev,
                        address: location
                      }))
                    }}
                    initialValue={doctorFormData.address}
                  />
                </div>

                {/* Password */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="doctor-password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="doctor-password"
                          name="password"
                          value={doctorFormData.password}
                          onChange={handleDoctorInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doctor-confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="doctor-confirmPassword"
                          name="confirmPassword"
                          value={doctorFormData.confirmPassword}
                          onChange={handleDoctorInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={doctorFormData.bio}
                    onChange={handleDoctorInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your professional background and expertise..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Doctor Account'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href={registerType === 'patient' ? '/login?type=patient' : '/login?type=doctor'} 
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage
