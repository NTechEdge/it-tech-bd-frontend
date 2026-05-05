import { httpClient } from '@/lib/utils/httpClient';
import { config } from '@/lib/config/env';
import { authService } from './authService';
import { couponService } from './couponService';

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
  isBanned: boolean;
  banReason?: string;
  bannedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  bannedAt?: string;
  banExpiresAt?: string;
  address?: {
    division?: string;
    district?: string;
    city?: string;
  };
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
  originalAmount?: number;
  discountAmount?: number;
  couponCode?: string;
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
  teacherId?: string | { _id: string; name: string; email: string; image?: string; category?: string } | null;
  teacherName: string;
  teacherTitle?: string;
  teacherBio?: string;
  teacherImage?: string;
  // For backward compatibility with old courses
  instructorId?: string | { _id: string; name: string; email: string } | null;
  instructorName?: string;
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
  teacherId: string;
  isInstructorAdmin?: boolean;
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

  // Ban/Unban Students
  async getBanReasons(): Promise<{
    success: boolean;
    data: { reasons: string[] };
  }> {
    return httpClient.get('/admin/ban-reasons');
  },

  async banStudent(id: string, data: {
    banReason: string;
    durationHours?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      userId: string;
      isBanned: boolean;
      banReason: string;
      bannedAt: string;
      banExpiresAt?: string;
      isTemporary: boolean;
    };
  }> {
    return httpClient.patch(`/admin/students/${id}/ban`, data);
  },

  async unbanStudent(id: string): Promise<{
    success: boolean;
    message: string;
    data: {
      userId: string;
      isBanned: boolean;
    };
  }> {
    return httpClient.patch(`/admin/students/${id}/unban`);
  },

  async getBannedStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      students: Student[];
      pagination: Pagination;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return httpClient.get(`/admin/students/banned${query ? `?${query}` : ''}`);
  },

  // Course-level ban
  async banStudentFromCourse(studentId: string, courseId: string, data: {
    banReason: string;
    durationHours?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      enrollmentId: string;
      userId: string;
      courseId: string;
      banReason: string;
      bannedAt: string;
      banExpiresAt?: string;
      isTemporary: boolean;
    };
  }> {
    return httpClient.patch(`/admin/students/${studentId}/courses/${courseId}/ban`, data);
  },

  async unbanStudentFromCourse(studentId: string, courseId: string): Promise<{
    success: boolean;
    message: string;
    data: { enrollmentId: string; userId: string; courseId: string; isBanned: boolean };
  }> {
    return httpClient.patch(`/admin/students/${studentId}/courses/${courseId}/unban`);
  },

  async getCourseBannedStudents(courseId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      students: Array<{
        _id: string;
        userId: { _id: string; name: string; email: string; image?: string };
        courseBan: {
          isBanned: boolean;
          banReason?: string;
          bannedAt?: string;
          banExpiresAt?: string;
          bannedBy?: { name: string; email: string };
        };
      }>;
      pagination: Pagination;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return httpClient.get(`/admin/courses/${courseId}/banned-students${query ? `?${query}` : ''}`);
  },

  async getStudentCourseBans(studentId: string): Promise<{
    success: boolean;
    data: {
      courseBans: Array<{
        _id: string;
        courseId: { _id: string; title: string; category: string; thumbnailUrl: string };
        courseBan: {
          isBanned: boolean;
          banReason?: string;
          bannedAt?: string;
          banExpiresAt?: string;
        };
      }>;
    };
  }> {
    return httpClient.get(`/admin/students/${studentId}/course-bans`);
  },

  async getStudentEnrolledCourses(studentId: string): Promise<{
    success: boolean;
    data: {
      courses: Array<{
        _id: string;
        title: string;
        category: string;
        thumbnailUrl: string;
        isCourseBanned: boolean;
        courseBanReason?: string;
        courseBanExpiresAt?: string;
      }>;
    };
  }> {
    return httpClient.get(`/admin/students/${studentId}/enrolled-courses`);
  },

  // Location Analytics
  async getLocationStats(): Promise<{
    success: boolean;
    data: {
      totalStudents: number;
      studentsWithAddress: number;
      studentsWithoutAddress: number;
      byDivision: Array<{ division: string; count: number }>;
      byDistrict: Array<{ division: string; district: string; count: number }>;
      byCity: Array<{ division: string; district: string; city: string; count: number }>;
    };
  }> {
    return httpClient.get('/admin/location/stats');
  },

  async getEnrollmentByLocation(): Promise<{
    success: boolean;
    data: {
      byDivision: Array<{ division: string; totalEnrollments: number; totalRevenue: number }>;
      byDistrict: Array<{ division: string; district: string; totalEnrollments: number; totalRevenue: number }>;
      byCity: Array<{ division: string; district: string; city: string; totalEnrollments: number; totalRevenue: number }>;
    };
  }> {
    return httpClient.get('/admin/location/enrollments');
  },

  async getStudentsByLocation(params?: {
    division?: string;
    district?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      students: Student[];
      pagination: Pagination;
      filters: {
        division?: string;
        district?: string;
        city?: string;
      };
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.division) queryParams.append('division', params.division);
    if (params?.district) queryParams.append('district', params.district);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return httpClient.get(`/admin/location/students${query ? `?${query}` : ''}`);
  },

  async getLocationReport(): Promise<{
    success: boolean;
    data: {
      topDivisions: {
        byStudents: Array<{ division: string; studentCount: number }>;
        byRevenue: Array<{ division: string; totalRevenue: number; enrollmentCount: number }>;
      };
      recentStudents: Student[];
      profileCompletion: {
        totalStudents: number;
        studentsWithCompleteProfile: number;
        completionRate: string;
      };
    };
  }> {
    return httpClient.get('/admin/location/report');
  },

  // Coupons
  async getAllCoupons(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'expired' | 'disabled';
    scope?: 'all' | 'specific' | 'category';
    search?: string;
    sort?: string;
  }) {
    return couponService.getAllCoupons(params);
  },

  async getCouponById(id: string) {
    return couponService.getCouponById(id);
  },

  async createCoupon(data: {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscountAmount?: number;
    scope: 'all' | 'specific' | 'category';
    applicableCourses?: string[];
    applicableCategories?: string[];
    minPurchaseAmount?: number;
    usageLimit: number;
    perUserLimit: number;
    validFrom: string;
    validUntil: string;
  }) {
    return couponService.createCoupon(data);
  },

  async updateCoupon(id: string, data: {
    description?: string;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    maxDiscountAmount?: number;
    scope?: 'all' | 'specific' | 'category';
    applicableCourses?: string[];
    applicableCategories?: string[];
    minPurchaseAmount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validFrom?: string;
    validUntil?: string;
    status?: 'active' | 'expired' | 'disabled';
  }) {
    return couponService.updateCoupon(id, data);
  },

  async deleteCoupon(id: string) {
    return couponService.deleteCoupon(id);
  },

  async getCouponStats() {
    return couponService.getCouponStats();
  },

  async generateCouponCode(length?: number) {
    return couponService.generateCouponCode(length);
  },
};
