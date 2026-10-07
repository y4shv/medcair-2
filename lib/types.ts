export type UserRole = 'patient';

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
