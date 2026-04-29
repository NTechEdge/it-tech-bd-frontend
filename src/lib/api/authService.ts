import { httpClient } from '@/lib/utils/httpClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
  isVerified?: boolean;
  createdAt?: string;
  enrolledCourses?: string[];
  interestedTopics?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  interestedTopics?: string[];
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/register', credentials);
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ success: boolean; message: string; data: { email: string } }> {
    return httpClient.post('/auth/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    return httpClient.post('/auth/reset-password', data);
  },

  async getProfile(): Promise<ProfileResponse> {
    return httpClient.get<ProfileResponse>('/auth/profile');
  },

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      document.cookie = `token=${token}; path=/; max-age=604800; sameSite=lax`;
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; max-age=0';
    }
  },

  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; sameSite=lax`;
    }
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      document.cookie = 'user=; path=/; max-age=0';
    }
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};
