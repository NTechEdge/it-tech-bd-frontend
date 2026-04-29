import { httpClient } from '@/lib/utils/httpClient';
import { config } from '@/lib/config/env';
import { authService } from './authService';

// Dashboard Stats
export interface DashboardStats {
  stats: {
    totalStudents: number;
    totalCourses: number;
    activeCourses: number;
    inactiveCourses: number;
    totalEnrollments: number;
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number;
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
  instructorId: string | { _id: string; name: string; email: string };
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

  // Instructors (Admin users)
  async getInstructors(): Promise<{ success: boolean; data: { admins: Array<{ _id: string; name: string; email: string }> } }> {
    return httpClient.get('/admin/instructors');
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

  // Analytics
  async getAllCoursesAnalytics(): Promise<{
    success: boolean;
    data: {
      totalCourses: number;
      courses: Array<{
        courseId: string;
        title: string;
        category: string;
        totalEnrolled: number;
        totalViews: number;
        totalCompleted: number;
        avgCompletionRate: number;
        avgWatchTimePerStudent: number;
        totalWatchTimeSeconds: number;
      }>;
    };
  }> {
    return httpClient.get('/admin/analytics/courses');
  },

  async getTopLessons(limit?: number): Promise<{
    success: boolean;
    data: {
      total: number;
      topLessons: Array<{
        lessonId: string;
        title: string;
        courseId: string;
        courseTitle: string;
        category: string;
        durationSeconds: number;
        totalViews: number;
        avgWatchTimeSeconds: number;
        completionRate: number;
      }>;
    };
  }> {
    const query = limit ? `?limit=${limit}` : '';
    return httpClient.get(`/admin/analytics/top-lessons${query}`);
  },

  async getCourseAnalytics(courseId: string): Promise<{
    success: boolean;
    data: {
      courseId: string;
      courseTitle: string;
      totalEnrolled: number;
      totalViews: number;
      avgCompletionRate: number;
      lessons: Array<{
        lessonId: string;
        title: string;
        durationSeconds: number;
        totalViews: number;
        uniqueViewers: number;
        totalWatchTimeSeconds: number;
        avgWatchTimeSeconds: number;
        completedCount: number;
        completionRate: number;
        avgWatchPercentage: number;
      }>;
    };
  }> {
    return httpClient.get(`/admin/analytics/courses/${courseId}`);
  },

  async getStudentEngagementReport(courseId: string): Promise<{
    success: boolean;
    data: {
      courseId: string;
      courseTitle: string;
      summary: {
        totalEnrolled: number;
        activeStudents: number;
        completedStudents: number;
        avgWatchTimePerStudent: number;
        overallCompletionRate: number;
        totalWatchTimeSeconds: number;
      };
      students: Array<{
        userId: string;
        name: string;
        email: string;
        totalWatchTimeSeconds: number;
        completedLessons: number;
        totalLessons: number;
        progressPercentage: number;
        enrolledAt: string;
      }>;
    };
  }> {
    return httpClient.get(`/admin/analytics/courses/${courseId}/students`);
  },
};
