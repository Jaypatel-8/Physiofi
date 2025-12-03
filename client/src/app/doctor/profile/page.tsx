'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CameraIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import toast from 'react-hot-toast'
import Image from 'next/image'

const DoctorProfile = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: [] as string[],
    experience: '',
    license: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [newSpecialization, setNewSpecialization] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for auth context to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      
      if (!storedToken || !storedUser) {
        router.push('/login')
        return
      }
      
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== 'doctor') {
          router.push('/login')
          return
        }
        
        // Load profile data
        loadProfile()
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getProfile()
      const data = response.data?.data || response.data || {}
      setProfileData(data)
      setFormData({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || user?.phone || '',
        specialization: Array.isArray(data.specialization) ? data.specialization : (data.specialization ? [data.specialization] : []),
        experience: data.experience?.toString() || '',
        license: data.license || '',
        bio: data.bio || '',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      })
      setProfileImage(data.profileImage || null)
    } catch (error: any) {
      console.error('Load profile error:', error)
      // If API fails, use user data from auth context or localStorage
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      const userData = user || (storedUser ? JSON.parse(storedUser) : null)
      
      if (userData) {
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || userData.mobile || '',
          specialization: [],
          experience: '',
          license: '',
          bio: '',
          address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
          }
        })
      }
      toast.error(error.response?.data?.message || 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !formData.specialization.includes(newSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization.trim()]
      }))
      setNewSpecialization('')
    }
  }

  const handleRemoveSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== spec)
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await doctorAPI.updateProfile({
        ...formData,
        experience: parseInt(formData.experience),
        profileImage
      })
      toast.success('Profile updated successfully')
      setIsEditing(false)
      loadProfile()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading only if we don't have any user data at all
  const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const hasUserData = user || storedUserStr

  if (isLoading && !profileData && !hasUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Doctor Profile" subtitle="Manage your professional information" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 relative overflow-hidden"
        >
          {/* Book Corner Effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

          <div className="relative z-10">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={formData.name || 'Profile'}
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-primary-200"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {(formData.name || 'D')[0].toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-3 rounded-full cursor-pointer hover:bg-primary-600 transition-colors duration-300 shadow-lg">
                    <CameraIcon className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 font-display">{formData.name}</h2>
              <p className="text-gray-600">{formData.email}</p>
              {profileData?.rating && (
                <div className="flex items-center space-x-1 mt-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {profileData.rating.average?.toFixed(1)}/5.0
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({profileData.rating.count || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mb-6 space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      loadProfile()
                    }}
                    className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <p className="text-gray-900 font-medium">{formData.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-2" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <BriefcaseIcon className="h-4 w-4 inline mr-2" />
                  Experience (Years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.experience} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <AcademicCapIcon className="h-4 w-4 inline mr-2" />
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.license}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialization
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialization()}
                        placeholder="Add specialization"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddSpecialization}
                        className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {spec}
                          <button
                            onClick={() => handleRemoveSpecialization(spec)}
                            className="ml-2 text-primary-700 hover:text-primary-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.specialization.length > 0 ? (
                      formData.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No specializations added</p>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about your professional background..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium whitespace-pre-wrap">
                    {formData.bio || 'No bio added'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.pincode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DoctorProfile

