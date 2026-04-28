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
        const error = await response.json().catch(() => ({
          message: 'An error occurred',
        }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Re-throw with more context
      if (error instanceof Error) {
        console.error('API Request Error:', {
          endpoint: `${this.baseUrl}${endpoint}`,
          method: fetchOptions.method || 'GET',
          error: error.message,
        });
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
