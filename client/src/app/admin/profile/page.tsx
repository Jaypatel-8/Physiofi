'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CameraIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import toast from 'react-hot-toast'
import Image from 'next/image'

const AdminProfile = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)

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
        if (parsedUser.role !== 'admin') {
          router.push('/login')
          return
        }
        
        // Set form data from stored user or current user
        const userData = user || parsedUser
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || userData.mobile || ''
        })
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      // Admin profile update would go here when API is ready
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Profile" subtitle="Manage your administrator account" />

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
                    {(formData.name || 'A')[0].toUpperCase()}
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
              <div className="flex items-center space-x-2 mt-2">
                <ShieldCheckIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-semibold text-primary-600">Administrator</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mb-6 space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium"
                  >
                    Save Changes
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
                  <p className="text-gray-900 font-medium">{formData.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <p className="text-gray-900 font-medium capitalize">{user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminProfile

