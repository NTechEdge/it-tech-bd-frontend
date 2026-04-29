"use client";

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useEffect } from 'react';
import { setCredentials, clearAuth } from '@/lib/redux/slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          store.dispatch(setCredentials({
            user: {
              _id: user.id,
              email: user.email,
              firstName: user.name.split(' ')[0] || user.name,
              lastName: user.name.split(' ').slice(1).join(' ') || '',
              name: user.name,
              role: user.role,
            },
            token
          }));
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
          store.dispatch(clearAuth());
        }
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
