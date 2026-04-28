import { httpClient } from '@/lib/utils/httpClient';
import { config } from '@/lib/config/env';
import { authService } from './authService';

// Dashboard Stats
export interface DashboardStats {
  stats: {
    totalStudents: number;
    totalCourses: number;
    activeCourses: number;
    totalRevenue: number;
  };
  recentEnrollments: Array<{
    _id: string;
    userId: { name: string; email: string };
    courseId: { title: string; price: number };
    amount: number;
    paymentStatus: 'pending' | 'approved' | 'rejected';
    purchasedAt: string;
  }>;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Students
export interface Student {
  _id: string;
  name: string;
  email: string;
  role: 'student';
  isVerified: boolean;
  createdAt: string;
}

export interface StudentsResponse {
  success: boolean;
  data: {
    students: Student[];
    pagination: Pagination;
  };
}

// Payments/Enrollments
export interface PaymentEnrollment {
  _id: string;
  userId: { name: string; email: string };
  courseId: { title: string; price: number };
  amount: number;
  trxId: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  purchasedAt: string;
  approvedAt?: string;
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: PaymentEnrollment[];
    pagination: Pagination;
  };
}

// Settings
export interface PlatformSettings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  contactEmail: string;
  contactPhone: string;
  socialLinks: Record<string, string>;
  seo: Record<string, any>;
  features: Record<string, any>;
}

// Courses
export interface Course {
  _id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string | { name: string; email: string };
  sections: CourseSection[];
  isActive: boolean;
  createdAt: string;
}

export interface CourseSection {
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  durationSeconds: number;
}

export interface CreateCourseData {
  title: string;
  category: string;
  thumbnailUrl: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string;
  sections?: CourseSection[];
  isActive?: boolean;
}

export interface UploadThumbnailResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    path: string;
  };
}

export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    return httpClient.get('/admin/dashboard');
  },

  // Students
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<StudentsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return httpClient.get(`/admin/students${query ? `?${query}` : ''}`);
  },

  // Payments
  async getPayments(params?: {
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }): Promise<PaymentsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return httpClient.get(`/admin/payments${query ? `?${query}` : ''}`);
  },

  async approvePayment(id: string): Promise<{ success: boolean; message: string; data: PaymentEnrollment }> {
    return httpClient.patch(`/admin/payments/${id}/approve`);
  },

  async rejectPayment(id: string): Promise<{ success: boolean; message: string; data: PaymentEnrollment }> {
    return httpClient.patch(`/admin/payments/${id}/reject`);
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; data: PlatformSettings }> {
    return httpClient.get('/admin/settings');
  },

  async updateSettings(data: Partial<PlatformSettings>): Promise<{ success: boolean; message: string; data: PlatformSettings }> {
    return httpClient.patch('/admin/settings', data);
  },

  // Courses
  async getAllCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    level?: string;
    includeInactive?: boolean;
  }): Promise<{
    success: boolean;
    data: {
      courses: Course[];
      pagination: Pagination;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);

    const query = queryParams.toString();
    return httpClient.get(`/courses${query ? `?${query}` : ''}`);
  },

  async getCourseById(id: string): Promise<{ success: boolean; data: Course }> {
    return httpClient.get(`/courses/${id}`);
  },

  async createCourse(data: CreateCourseData): Promise<{ success: boolean; message: string; data: Course }> {
    return httpClient.post('/courses/', data);
  },

  async updateCourse(id: string, data: Partial<CreateCourseData>): Promise<{ success: boolean; message: string; data: Course }> {
    return httpClient.put(`/courses/${id}`, data);
  },

  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    return httpClient.delete(`/courses/${id}`);
  },

  async uploadThumbnail(file: File): Promise<UploadThumbnailResponse> {
    const formData = new FormData();
    formData.append('thumbnail', file);

    const response = await fetch(`${config.apiUrl}/courses/upload-thumbnail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },
};
