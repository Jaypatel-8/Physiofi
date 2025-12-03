export interface User {
  id: string
  name: string
  mobile: string
  email?: string
  role: 'patient' | 'doctor' | 'admin'
  isVerified?: boolean
  isApproved?: boolean
  permissions?: string[]
}

export interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: User
}

export interface OTPResponse {
  success: boolean
  message: string
  mobile?: string
}

