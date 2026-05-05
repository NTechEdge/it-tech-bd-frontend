/**
 * Server-side API utilities for Next.js Server Components
 * These utilities are designed to work in Server Components and route handlers
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Course {
  _id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teacherId?: string;
  teacherName?: string;
  teacherTitle?: string;
  teacherBio?: string;
  teacherImage?: string;
  instructorId?: string;
  instructorName?: string;
  sections: Array<{
    title: string;
    lessons: Array<{
      title: string;
      youtubeUrl: string;
      youtubeId: string;
      durationSeconds: number;
    }>;
  }>;
  isActive: boolean;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: {
    courses: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } | T[];
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch data from API with proper error handling and caching
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Add cache control for server-side fetching with tag-based revalidation
      next: {
        revalidate: 60, // Default revalidate time
        tags: [],
        ...options?.next,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API Error: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Failed to fetch from API: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetch all courses with optional filters and tag-based revalidation
 */
export async function getCourses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  level?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.level) queryParams.append('level', params.level);

  const queryString = queryParams.toString();
  const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;

  return fetchFromAPI<PaginatedResponse<Course>>(endpoint, {
    next: {
      tags: ['courses'],
    },
  });
}

/**
 * Fetch a single course by ID with tag-based revalidation
 */
export async function getCourseById(id: string): Promise<Course> {
  const response = await fetchFromAPI<{ data: Course }>(`/courses/${id}`, {
    next: {
      tags: [`course-${id}`, 'courses'],
    },
  });
  return response.data || response;
}

/**
 * Fetch featured courses
 */
export async function getFeaturedCourses(limit: number = 6) {
  return fetchFromAPI<PaginatedResponse<Course>>(
    `/courses?limit=${limit}&featured=true`
  );
}

/**
 * Generate static params for ISR courses
 */
export async function generateCourseParams() {
  const response = await getCourses({ limit: 100 });
  const courses = Array.isArray(response.data)
    ? response.data
    : response.data?.courses || [];

  return courses.map((course) => ({
    id: course._id,
  }));
}

/**
 * Get course count for metadata
 */
export async function getCourseCount() {
  try {
    const response = await getCourses({ limit: 1 });
    const pagination = Array.isArray(response.data)
      ? null
      : response.data?.pagination;

    return pagination?.total || 0;
  } catch {
    return 0;
  }
}

export type { Course, PaginatedResponse };
export { ApiError };
