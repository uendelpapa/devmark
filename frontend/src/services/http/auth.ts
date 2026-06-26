import { api } from '../../lib/axios'
import type { AuthUser } from '../../lib/auth'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await api.post('/auth/login', data)
  return response.data
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post('/auth/register', data)
  return response.data
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post('/auth/refresh')
  return response.data
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
}

export async function fetchMe(): Promise<AuthUser> {
  const response = await api.get('/auth/me')
  return response.data
}

export async function updateProfile(data: UpdateProfileData): Promise<AuthUser> {
  const response = await api.patch('/auth/profile', data)
  return response.data
}
