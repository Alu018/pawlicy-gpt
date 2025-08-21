// database types

export interface User {
  id: string
  email: string
  full_name: string
  organization_name?: string
  password_hash: string
  onboarding_completed: boolean
  region?: string
  role?: string
  collaboration_preferences?: string
  created_at: string
  updated_at: string
}