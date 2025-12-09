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
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
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
    // Don't automatically redirect on 401 - let the auth provider handle it
    // This prevents conflicts with the auth context
    if (error.response?.status === 401) {
      // Only clear storage if we're not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Let the auth provider handle logout to avoid race conditions
        console.warn('401 Unauthorized - Auth provider will handle logout')
      }
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

  // Treatment Plans
  getTreatmentPlans: (params?: any) => 
    api.get('/patients/treatment-plans', { params }),
  
  getTreatmentPlan: (id: string) => 
    api.get(`/patients/treatment-plans/${id}`),
  
  addTreatmentPlanNote: (id: string, note: string) => 
    api.post(`/patients/treatment-plans/${id}/notes`, { note }),
}

// Doctor API
export const doctorAPI = {
  register: (data: any) => 
    api.post('/auth/doctor/register', data),
  
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
  getAvailability: () => 
    api.get('/doctors/availability'),
  
  updateAvailability: (data: any) => 
    api.patch('/doctors/availability', data),
  
  // Analytics
  getAnalytics: (period?: string) => 
    api.get('/doctors/analytics', { params: { period } }),

  // Conditions and Treatment Plans (Doctor's general conditions - kept for reference)
  getConditions: () => 
    api.get('/doctors/conditions'),
  
  addCondition: (data: any) => 
    api.post('/doctors/conditions', data),
  
  updateCondition: (id: string, data: any) => 
    api.put(`/doctors/conditions/${id}`, data),
  
  deleteCondition: (id: string) => 
    api.delete(`/doctors/conditions/${id}`),

  // Patient-specific Treatment Plans
  getPatientTreatmentPlans: (patientId: string) => 
    api.get(`/doctors/patients/${patientId}/treatment-plans`),
  
  createPatientTreatmentPlan: (patientId: string, data: any) => 
    api.post(`/doctors/patients/${patientId}/treatment-plans`, data),
  
  updatePatientTreatmentPlan: (id: string, data: any) => 
    api.put(`/doctors/treatment-plans/${id}`, data),
  
  deletePatientTreatmentPlan: (id: string) => 
    api.delete(`/doctors/treatment-plans/${id}`),

  // Medical Records
  getMedicalRecords: (params?: any) => 
    api.get('/medical-records', { params }),
  
  getMedicalRecord: (id: string) => 
    api.get(`/medical-records/${id}`),
  
  uploadMedicalRecord: (data: any) => 
    api.post('/medical-records', data),
  
  deleteMedicalRecord: (id: string) => 
    api.delete(`/medical-records/${id}`),

  // Prescriptions
  getPrescriptions: (params?: any) => 
    api.get('/prescriptions', { params }),
  
  getPrescription: (id: string) => 
    api.get(`/prescriptions/${id}`),
  
  createPrescription: (data: any) => 
    api.post('/prescriptions', data),
  
  updatePrescription: (id: string, data: any) => 
    api.put(`/prescriptions/${id}`, data),
  
  deletePrescription: (id: string) => 
    api.delete(`/prescriptions/${id}`),

  // Exercise Plans
  getExercisePlans: (params?: any) => 
    api.get('/exercise-plans', { params }),
  
  getExercisePlan: (id: string) => 
    api.get(`/exercise-plans/${id}`),
  
  createExercisePlan: (data: any) => 
    api.post('/exercise-plans', data),
  
  updateExercisePlan: (id: string, data: any) => 
    api.put(`/exercise-plans/${id}`, data),
  
  deleteExercisePlan: (id: string) => 
    api.delete(`/exercise-plans/${id}`),

  // Session Notes
  getSessionNotes: (params?: any) => 
    api.get('/session-notes', { params }),
  
  getSessionNote: (id: string) => 
    api.get(`/session-notes/${id}`),
  
  createSessionNote: (data: any) => 
    api.post('/session-notes', data),
  
  updateSessionNote: (id: string, data: any) => 
    api.put(`/session-notes/${id}`, data),
  
  deleteSessionNote: (id: string) => 
    api.delete(`/session-notes/${id}`),
}

// Doctor Public API (for patients to view)
export const doctorPublicAPI = {
  getDoctor: (id: string) => 
    api.get(`/doctors/${id}`),
  
  getAvailableDoctors: (params?: any) => 
    api.get('/doctors/available', { params }),
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

  // Reschedule
  requestReschedule: (id: string, data: { newDate: string; newTime: string; reason: string }) => 
    api.post(`/appointments/${id}/reschedule-request`, data),
  
  respondToReschedule: (id: string, action: 'accept' | 'decline', declinedReason?: string) => 
    api.patch(`/appointments/${id}/reschedule-response`, { action, declinedReason }),
  
  reschedule: (id: string, data: { newDate: string; newTime: string; reason: string }) => 
    api.patch(`/appointments/${id}/reschedule`, data),
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

  // Medical Records
  getMedicalRecords: (params?: any) => 
    api.get('/medical-records', { params }),
  
  getMedicalRecord: (id: string) => 
    api.get(`/medical-records/${id}`),
  
  uploadMedicalRecord: (data: any) => 
    api.post('/medical-records', data),
  
  deleteMedicalRecord: (id: string) => 
    api.delete(`/medical-records/${id}`),

  // Prescriptions
  getPrescriptions: (params?: any) => 
    api.get('/prescriptions', { params }),
  
  getPrescription: (id: string) => 
    api.get(`/prescriptions/${id}`),

  // Exercise Plans
  getExercisePlans: (params?: any) => 
    api.get('/exercise-plans', { params }),
  
  getExercisePlan: (id: string) => 
    api.get(`/exercise-plans/${id}`),

  // Session Notes
  getSessionNotes: (params?: any) => 
    api.get('/session-notes', { params }),
  
  getSessionNote: (id: string) => 
    api.get(`/session-notes/${id}`),

  // Payments
  getPayments: (params?: any) => 
    api.get('/payments', { params }),
  
  getPayment: (id: string) => 
    api.get(`/payments/${id}`),
  
  updatePaymentStatus: (id: string, data: any) => 
    api.put(`/payments/${id}/status`, data),
  
  getPaymentStats: (params?: any) => 
    api.get('/payments/stats/overview', { params }),
}

export default api












