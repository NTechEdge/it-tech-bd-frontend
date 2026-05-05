'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import {
  login as loginAction,
  register as registerAction,
  checkAuth,
  refreshUser as refreshUserAction,
  logout as logoutAction,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@/lib/redux/slices/authSlice';
import { authService, User, LoginCredentials, RegisterCredentials, ForgotPasswordData, ResetPasswordData } from '@/lib/api/authService';
import { profileService } from '@/lib/api/profileService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string; error?: string }>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ success: boolean; message: string; error?: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateInterests: (topics: string[]) => Promise<{ success: boolean; message: string; error?: string }>;
  isAuthenticated: boolean;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  // Read auth state from Redux (single source of truth)
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    // Check auth on mount - Redux will handle the state
    dispatch(checkAuth());
  }, [dispatch]);

  const login = async (credentials: LoginCredentials) => {
    try {
      await dispatch(loginAction(credentials)).unwrap();
      return { success: true, message: 'Login successful' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await dispatch(registerAction(credentials)).unwrap();
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      const response = await authService.forgotPassword(data);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await authService.resetPassword(data);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const refreshUser = async () => {
    try {
      await dispatch(refreshUserAction()).unwrap();
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateInterests = async (topics: string[]) => {
    try {
      const response = await profileService.updateInterests({ interestedTopics: topics });
      if (response.success) {
        // Refresh user from server to get updated data
        await dispatch(refreshUserAction()).unwrap();
        return { success: true, message: response.message || 'Interests updated successfully' };
      }
      return { success: false, message: 'Failed to update interests' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update interests';
      return { success: false, message: errorMessage, error: errorMessage };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
        updateInterests,
        isAuthenticated,
        clearAuthError,
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

// Direct Redux hooks for components that don't need the full AuthContext
export function useAuthState() {
  return {
    user: useSelector(selectUser),
    isAuthenticated: useSelector(selectIsAuthenticated),
    loading: useSelector(selectAuthLoading),
    error: useSelector(selectAuthError),
  };
}
