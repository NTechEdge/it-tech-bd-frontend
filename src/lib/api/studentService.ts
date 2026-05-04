import { httpClient } from '@/lib/utils/httpClient';

export interface LessonProgress {
  lessonId: string;
  watchTimeSeconds: number;
  isCompleted: boolean;
}

export interface Course {
  _id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teacherId?: string | null;
  teacherName: string;
  teacherTitle?: string;
  teacherBio?: string;
  teacherImage?: string;
  // For backward compatibility with old courses
  instructorId?: string | null;
  instructorName?: string;
  sections: CourseSection[];
  isActive: boolean;
  createdAt: string;
}

export interface CourseSection {
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  durationSeconds: number;
}

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  amount: number;
  trxId: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  purchasedAt: string;
  approvedAt?: string;
  progress: LessonProgress[];
  courseBan?: {
    isBanned: boolean;
    banReason?: string;
    banExpiresAt?: string;
  };
}

export interface EnrolledCourse {
  enrollment: {
    id: string;
    purchasedAt: string;
    amount: number;
    progress: LessonProgress[];
  };
  course: Course;
}

export interface EnrollCourseData {
  courseId: string;
  amount: number;
  trxId: string;
}

export interface UpdateProgressData {
  courseId: string;
  lessonId: string;
  watchTimeSeconds: number;
  isCompleted: boolean;
}

export interface CourseProgressResponse {
  enrollment: Enrollment;
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
}

export const studentService = {
  async getMyCourses(): Promise<{ success: boolean; data: EnrolledCourse[] }> {
    return httpClient.get('/students/my-courses');
  },

  async enrollCourse(data: EnrollCourseData): Promise<{ success: boolean; message: string; data: Enrollment }> {
    return httpClient.post('/students/enroll', data);
  },

  async updateProgress(data: UpdateProgressData): Promise<{
    success: boolean;
    message: string;
    data: {
      progress: LessonProgress[];
      progressPercentage: number;
      totalLessons: number;
      completedLessons: number;
    };
  }> {
    return httpClient.patch('/students/progress', data);
  },

  async getCourseProgress(courseId: string): Promise<{ success: boolean; data: CourseProgressResponse }> {
    return httpClient.get(`/students/progress/${courseId}`);
  },
};
