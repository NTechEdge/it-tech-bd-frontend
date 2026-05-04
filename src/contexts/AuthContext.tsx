'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { authService, User, LoginCredentials, RegisterCredentials, ForgotPasswordData, ResetPasswordData } from '@/lib/api/authService';
import { profileService } from '@/lib/api/profileService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string; error?: string }>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ success: boolean; message: string; error?: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateInterests: (topics: string[]) => Promise<{ success: boolean; message: string; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        // Verify token is still valid
        const profile = await authService.getProfile();
        if (profile.success) {
          setUser(profile.data);
          authService.saveUser(profile.data);
        }
      }
    } catch (error) {
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authService.login(credentials);
      console.log('Login response:', response);

      if (response.success) {
        authService.saveToken(response.data.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
        console.log('Login successful, user set:', response.data.user);
        return { success: true, message: response.message };
      }
      console.log('Login failed: response.success is false');
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      if (response.success) {
        authService.saveToken(response.data.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
        return { success: true, message: response.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Registration failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      const response = await authService.forgotPassword(data);
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to send OTP', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await authService.resetPassword(data);
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Password reset failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile.success) {
        setUser(profile.data);
        authService.saveUser(profile.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateInterests = async (topics: string[]) => {
    try {
      const response = await profileService.updateInterests({ interestedTopics: topics });
      if (response.success) {
        // Refresh the full user profile after updating interests
        const profile = await authService.getProfile();
        if (profile.success) {
          setUser(profile.data);
          authService.saveUser(profile.data);
        }
        return { success: true, message: response.message || 'Interests updated successfully' };
      }
      return { success: false, message: 'Failed to update interests' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update interests', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
        updateInterests,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
