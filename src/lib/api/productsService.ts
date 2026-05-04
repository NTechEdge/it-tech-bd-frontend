import { httpClient } from '@/lib/utils/httpClient';

export interface Product {
  _id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teacherId?: string | null;
  teacherName?: string;
  teacherTitle?: string;
  teacherBio?: string;
  teacherImage?: string;
  // For backward compatibility with old courses
  instructorId?: string | null;
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

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export const productsService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    level?: string;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.level) queryParams.append('level', params.level);

    const queryString = queryParams.toString();
    return httpClient.get<ProductsResponse>(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  async getFeaturedProducts(): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>('/courses');
  },

  async getProductById(id: string): Promise<ProductResponse> {
    return httpClient.get<ProductResponse>(`/courses/${id}`);
  },

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    return httpClient.get<ProductResponse>(`/courses/slug/${slug}`);
  },

  async searchProducts(query: string): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>(`/courses?search=${encodeURIComponent(query)}`);
  },

  async getRelatedProducts(_productId: string): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>(`/courses`);
  },
};
