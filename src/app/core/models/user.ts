export interface User {
  id: number; // Changed from string to match backend
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'Customer' | 'Admin'; // Changed from 'ruole' to 'role'
  createdAt?: string; // Backend uses this instead of registrationDate

  // Optional frontend-only fields
  name?: string; // Computed from firstName + lastName
  initials?: string; // Computed for UI
  color?: string; // For avatar
  totalOrders?: number; // May come from profile endpoint
  lastOrderDate?: string; // May come from profile endpoint
}

export interface AuthResponse {
  token: string;
  refreshToken: string; // Added to match backend
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
