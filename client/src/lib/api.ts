import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  // Patient auth
  patientRegister: (data: any) => 
    api.post('/auth/patient/register', data),
  
  patientLogin: (email: string, password: string) => 
    api.post('/auth/patient/login', { email, password }),
  
  patientForgotPassword: (email: string) => 
    api.post('/auth/patient/forgot-password', { email }),
  
  patientResetPassword: (token: string, password: string) => 
    api.post('/auth/patient/reset-password', { token, password }),
  
  // Doctor auth
  doctorRegister: (data: any) => 
    api.post('/auth/doctor/register', data),
  
  doctorLogin: (email: string, password: string) => 
    api.post('/auth/doctor/login', { email, password }),
  
  doctorForgotPassword: (email: string) => 
    api.post('/auth/doctor/forgot-password', { email }),
  
  doctorResetPassword: (token: string, password: string) => 
    api.post('/auth/doctor/reset-password', { token, password }),
  
  // Admin auth
  adminLogin: (email: string, password: string) => 
    api.post('/auth/admin/login', { email, password }),
  
  adminForgotPassword: (email: string) => 
    api.post('/auth/admin/forgot-password', { email }),
  
  adminResetPassword: (token: string, password: string) => 
    api.post('/auth/admin/reset-password', { token, password }),
  
  // Get current user
  getCurrentUser: () => 
    api.get('/auth/me'),
  
  // Logout
  logout: () => 
    api.post('/auth/logout'),
}

// Patient API
export const patientAPI = {
  getProfile: () => 
    api.get('/patients/profile'),
  
  updateProfile: (data: any) => 
    api.put('/patients/profile', data),
  
  getAppointments: (params?: any) => 
    api.get('/patients/appointments', { params }),
  
  getAppointmentsByType: (type: 'Home Visit' | 'Online Consultation' | 'Clinic Visit', params?: any) => 
    api.get(`/appointments/type/${type}`, { params }),
  
  getAppointment: (id: string) => 
    api.get(`/patients/appointments/${id}`),
  
  cancelAppointment: (id: string, reason: string) => 
    api.put(`/patients/appointments/${id}/cancel`, { reason }),
  
  rateAppointment: (id: string, score: number, review?: string) => 
    api.post(`/patients/appointments/${id}/rate`, { score, review }),
  
  getStats: () => 
    api.get('/patients/stats'),
  
  getNotifications: (params?: any) => 
    api.get('/notifications', { params }),
  
  getUnreadCount: () => 
    api.get('/notifications/unread-count'),
  
  markAsRead: (id: string) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.patch('/notifications/read-all'),
  
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}`),
}

// Doctor API
export const doctorAPI = {
  register: (data: any) => 
    api.post('/doctors/register', data),
  
  getProfile: () => 
    api.get('/doctors/profile'),
  
  updateProfile: (data: any) => 
    api.put('/doctors/profile', data),
  
  getAppointments: (params?: any) => 
    api.get('/doctors/appointments', { params }),
  
  getAppointmentsByType: (type: 'Home Visit' | 'Online Consultation' | 'Clinic Visit', params?: any) => 
    api.get(`/appointments/type/${type}`, { params }),
  
  getAppointment: (id: string) => 
    api.get(`/doctors/appointments/${id}`),
  
  updateAppointmentStatus: (id: string, status: string, notes?: string) => 
    api.put(`/doctors/appointments/${id}/status`, { status, notes }),
  
  addPrescription: (id: string, prescription: any[]) => 
    api.post(`/doctors/appointments/${id}/prescription`, { prescription }),
  
  addExercises: (id: string, exercises: any[]) => 
    api.post(`/doctors/appointments/${id}/exercises`, { exercises }),
  
  getStats: () => 
    api.get('/doctors/stats'),
  
  getAllDoctors: (params?: any) => 
    api.get('/doctors', { params }),
  
  getNotifications: (params?: any) => 
    api.get('/notifications', { params }),
  
  getUnreadCount: () => 
    api.get('/notifications/unread-count'),
  
  markAsRead: (id: string) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.patch('/notifications/read-all'),
  
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}`),
  
  // Patients
  getPatients: (params?: any) => 
    api.get('/doctors/patients', { params }),
  
  getPatient: (patientId: string) => 
    api.get(`/doctors/patients/${patientId}`),
  
  // Availability
  updateAvailability: (data: any) => 
    api.patch('/doctors/availability', data),
  
  // Analytics
  getAnalytics: (period?: string) => 
    api.get('/doctors/analytics', { params: { period } }),
}

// Appointment API
export const appointmentAPI = {
  create: (data: any) => 
    api.post('/appointments', data),
  
  book: (data: any) => 
    api.post('/appointments', data),
  
  getAvailableSlots: (doctorId: string, date: string) => 
    api.get(`/appointments/available-slots/${doctorId}`, { params: { date } }),
  
  getAppointment: (id: string) => 
    api.get(`/appointments/${id}`),
  
  updateAppointment: (id: string, data: any) => 
    api.put(`/appointments/${id}`, data),
  
  deleteAppointment: (id: string) => 
    api.delete(`/appointments/${id}`),
  
  getAllAppointments: (params?: any) => 
    api.get('/appointments', { params }),
}

// Admin API
export const adminAPI = {
  getDashboard: () => 
    api.get('/admin/dashboard'),
  
  // Patients
  getPatients: (params?: any) => 
    api.get('/admin/patients', { params }),
  
  getPatient: (id: string) => 
    api.get(`/admin/patients/${id}`),
  
  updatePatient: (id: string, data: any) => 
    api.put(`/admin/patients/${id}`, data),
  
  deletePatient: (id: string) => 
    api.delete(`/admin/patients/${id}`),
  
  // Doctors
  getDoctors: (params?: any) => 
    api.get('/admin/doctors', { params }),
  
  getDoctor: (id: string) => 
    api.get(`/admin/doctors/${id}`),
  
  updateDoctor: (id: string, data: any) => 
    api.put(`/admin/doctors/${id}`, data),
  
  deleteDoctor: (id: string) => 
    api.delete(`/admin/doctors/${id}`),
  
  approveDoctor: (id: string, isApproved: boolean, reason?: string) => 
    api.put(`/admin/doctors/${id}/approve`, { isApproved, reason }),
  
  // Appointments
  getAppointments: (params?: any) => 
    api.get('/admin/appointments', { params }),
  
  getAppointment: (id: string) => 
    api.get(`/admin/appointments/${id}`),
  
  updateAppointment: (id: string, data: any) => 
    api.put(`/admin/appointments/${id}`, data),
  
  deleteAppointment: (id: string) => 
    api.delete(`/admin/appointments/${id}`),
  
  // Analytics
  getAnalytics: (period?: string) => 
    api.get('/admin/analytics', { params: { period } }),
}

export default api












