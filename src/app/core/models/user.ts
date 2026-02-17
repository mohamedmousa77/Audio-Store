export interface User {
  id: number; // Changed from string to match backend
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;  // Changed from 'phone' to match backend IdentityUser
  role: 'Customer' | 'Administrator'; // Backend returns 'Administrator' for admin users
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
  phoneNumber: string;  // Changed from 'phone' to match backend
  password: string;
  confirmPassword: string;  // Added to match backend
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
