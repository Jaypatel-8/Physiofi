export interface Patient {
  _id: string
  name: string
  mobile: string
  email?: string
  address: {
    street: string
    area: string
    city: string
    pincode: string
    state: string
  }
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  emergencyContact: {
    name: string
    mobile: string
    relation: string
  }
  medicalHistory: Array<{
    condition: string
    diagnosisDate: string
    currentMedication: string
    notes: string
  }>
  isVerified: boolean
  lastLogin?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  _id: string
  name: string
  mobile: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  experience: number
  education: Array<{
    degree: string
    institution: string
    year: number
  }>
  certifications: Array<{
    name: string
    issuingOrganization: string
    issueDate: string
    expiryDate?: string
  }>
  specialization: string[]
  licenseNumber: string
  address: {
    street: string
    area: string
    city: string
    pincode: string
    state: string
  }
  consultationFee: {
    homeVisit: number
    teleconsultation: number
  }
  availability: {
    monday: { start: string; end: string; isAvailable: boolean }
    tuesday: { start: string; end: string; isAvailable: boolean }
    wednesday: { start: string; end: string; isAvailable: boolean }
    thursday: { start: string; end: string; isAvailable: boolean }
    friday: { start: string; end: string; isAvailable: boolean }
    saturday: { start: string; end: string; isAvailable: boolean }
    sunday: { start: string; end: string; isAvailable: boolean }
  }
  bio?: string
  profileImage?: string
  isVerified: boolean
  isApproved: boolean
  lastLogin?: string
  isActive: boolean
  rating: {
    average: number
    count: number
  }
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  _id: string
  patient: string | Patient
  doctor: string | Doctor
  appointmentType: 'home_visit' | 'teleconsultation'
  appointmentDate: string
  appointmentTime: string
  duration: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  patientDetails: {
    name: string
    mobile: string
    address: {
      street: string
      area: string
      city: string
      pincode: string
      state: string
    }
  }
  condition: string
  symptoms: string[]
  medicalHistory: string[]
  currentMedications: string[]
  notes?: string
  doctorNotes?: string
  prescription: Array<{
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  exercises: Array<{
    name: string
    description: string
    repetitions: string
    sets: string
    frequency: string
    instructions: string
  }>
  followUpRequired: boolean
  followUpDate?: string
  followUpNotes?: string
  payment: {
    amount: number
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    method?: string
    transactionId?: string
    paidAt?: string
  }
  rating?: {
    score: number
    review?: string
    ratedAt: string
  }
  cancellationReason?: string
  cancelledBy?: 'patient' | 'doctor' | 'admin'
  cancelledAt?: string
  rescheduledFrom?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginationInfo {
  current: number
  pages: number
  total: number
}

export interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  recentAppointments: Appointment[]
  topDoctors: Doctor[]
}

export interface Analytics {
  appointments: {
    total: number
    completed: number
    cancelled: number
    homeVisits: number
    teleconsultations: number
  }
  patients: {
    total: number
    verified: number
  }
  doctors: {
    total: number
    approved: number
  }
  revenue: {
    totalRevenue: number
    homeVisitRevenue: number
    teleconsultationRevenue: number
  }
}












