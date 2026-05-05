import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, User } from '@/lib/api/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Async thunks for auth operations
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      // Verify token is still valid
      const profile = await authService.getProfile();
      if (profile.success) {
        authService.saveUser(profile.data);
        return { user: profile.data, token };
      }
    }
    throw new Error('No valid auth');
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);
    if (response.success) {
      authService.saveToken(response.data.token);
      authService.saveUser(response.data.user);
      return { user: response.data.user, token: response.data.token };
    }
    throw new Error(response.message || 'Login failed');
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string; interestedTopics?: string[] }) => {
    const response = await authService.register(credentials);
    if (response.success) {
      authService.saveToken(response.data.token);
      authService.saveUser(response.data.user);
      return { user: response.data.user, token: response.data.token };
    }
    throw new Error(response.message || 'Registration failed');
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async () => {
    const profile = await authService.getProfile();
    if (profile.success) {
      authService.saveUser(profile.data);
      return profile.data;
    }
    throw new Error('Failed to refresh user');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      authService.saveUser(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // refreshUser
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
