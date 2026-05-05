import { config } from '@/lib/config/env';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  private getAuthHeader(): { Authorization: string } | {} {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (!skipAuth) {
      Object.assign(headers, this.getAuthHeader());
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'An error occurred',
        }));

        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrorMessages = errorData.errors
            .map((e: any) => e.msg || e.message)
            .filter(Boolean)
            .join(', ');

          const error: any = new Error(validationErrorMessages || `Validation failed`);
          error.response = { data: errorData };
          throw error;
        }

        // Handle other errors
        const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        const error: any = new Error(errorMessage);
        error.response = { data: errorData };
        throw error;
      }

      return response.json();
    } catch (error) {
      // Re-throw with more context for network errors only
      if (error instanceof Error) {
        // Check for common network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('Network Error - Unable to connect to the API server:', {
            endpoint: `${this.baseUrl}${endpoint}`,
            method: fetchOptions.method || 'GET',
            hint: 'Please ensure the backend server is running on port 5000',
          });
          throw new Error('Unable to connect to the server. Please ensure the backend server is running.');
        }

        // Re-throw API errors without additional logging (already logged above at line 60)
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
