import { httpClient } from '@/lib/utils/httpClient';
import { config } from '@/lib/config/env';
import { authService } from './authService';

export interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  image: string;
  category: string;
  phoneNumber: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherForDropdown {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  category: string;
  image: string;
}

export interface CreateTeacherData {
  name: string;
  category: string;
  phoneNumber: string;
  image?: string;
}

export interface CreateTeacherWithImageData extends CreateTeacherData {
  imageFile?: File;
}

export interface UploadTeacherImageResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    path: string;
  };
}

export interface CreateTeacherResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    password: string;
    teacher: Teacher;
  };
}

export interface TeachersResponse {
  success: boolean;
  data: {
    teachers: Teacher[];
    count: number;
  };
}

export interface TeacherStatsResponse {
  success: boolean;
  data: {
    stats: {
      totalTeachers: number;
      activeTeachers: number;
      teachersByCategory: Record<string, number>;
    };
  };
}

export const teacherService = {
  async getAllTeachers(): Promise<TeachersResponse> {
    return httpClient.get('/teachers');
  },

  async getAvailableTeachers(): Promise<{ success: boolean; data: { teachers: TeacherForDropdown[]; count: number } }> {
    return httpClient.get('/teachers/available');
  },

  async getTeacherById(id: string): Promise<{ success: boolean; data: { teacher: Teacher } }> {
    return httpClient.get(`/teachers/${id}`);
  },

  async createTeacher(data: CreateTeacherWithImageData): Promise<CreateTeacherResponse> {
    // If imageFile is provided, use FormData for multipart upload
    if (data.imageFile) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('phoneNumber', data.phoneNumber);
      if (data.image) {
        formData.append('image', data.image);
      }
      formData.append('image', data.imageFile);

      const response = await fetch(`${config.apiUrl}/teachers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Creation failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    }

    // Otherwise, use regular JSON submission
    return httpClient.post('/teachers', data);
  },

  async uploadTeacherImage(file: File): Promise<UploadTeacherImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${config.apiUrl}/teachers/upload-image`, {
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

  async updateTeacher(id: string, data: Partial<CreateTeacherWithImageData & { isActive: boolean }>): Promise<{ success: boolean; message: string; data: { teacher: Teacher } }> {
    // If imageFile is provided, use FormData for multipart upload
    if (data.imageFile) {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.category) formData.append('category', data.category);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.image) formData.append('image', data.image);
      if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
      formData.append('image', data.imageFile);

      const response = await fetch(`${config.apiUrl}/teachers/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Update failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    }

    // Otherwise, use regular JSON submission
    return httpClient.put(`/teachers/${id}`, data);
  },

  async deleteTeacher(id: string): Promise<{ success: boolean; message: string; data: { teacher: Teacher } }> {
    return httpClient.delete(`/teachers/${id}`);
  },

  async regenerateCredentials(id: string): Promise<CreateTeacherResponse> {
    return httpClient.post(`/teachers/${id}/regenerate-credentials`);
  },

  async getTeacherStats(): Promise<TeacherStatsResponse> {
    return httpClient.get('/teachers/stats');
  },

  async searchTeachers(query: string): Promise<TeachersResponse> {
    return httpClient.get(`/teachers/search?q=${encodeURIComponent(query)}`);
  },
};

export const teacherDashboardService = {
  async getMyCourses(): Promise<{
    success: boolean;
    data: {
      courses: Array<{
        _id: string;
        title: string;
        category: string;
        thumbnailUrl: string;
        shortDesc: string;
        price: number;
        level: string;
        instructorId: string;
        createdAt: string;
      }>;
      count: number;
      teacher: {
        id: string;
        teacherId: string;
        name: string;
        category: string;
      };
    };
  }> {
    return httpClient.get('/teachers/my-courses');
  },

  async getMyStats(): Promise<{
    success: boolean;
    data: {
      stats: Array<{
        courseId: string;
        title: string;
        totalEnrollments: number;
        approvedEnrollments: number;
        pendingEnrollments: number;
        totalRevenue: number;
      }>;
      totalCourses: number;
      totalRevenue: number;
      totalEnrollments: number;
    };
  }> {
    return httpClient.get('/teachers/my-stats');
  },
};
