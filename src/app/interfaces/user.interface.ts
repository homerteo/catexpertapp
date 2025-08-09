export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  isActive: boolean
}

export interface LoginCredentials {
  email: string,
  password: string,
}

export interface AuthResponse {
  success: boolean,
  user?: User,
  token?: string,
  message?: string,
}
