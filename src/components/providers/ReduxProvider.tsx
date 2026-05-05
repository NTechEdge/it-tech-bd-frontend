"use client";

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useEffect } from 'react';
import { checkAuth } from '@/lib/redux/slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on mount
    // The checkAuth thunk will verify the token and load user data
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      // Only check auth if we have both token and user in localStorage
      if (token && userStr) {
        store.dispatch(checkAuth());
      } else {
        // Clear any invalid state
        store.dispatch({ type: 'auth/clearAuth' });
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
