import { httpClient } from '@/lib/utils/httpClient';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  images: Array<{ url: string; publicId: string; alt?: string }>;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor?: {
    _id: string;
    name: string;
  };
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  language?: string;
  rating: {
    average: number;
    count: number;
  };
  enrolledCount?: number;
  isActive: boolean;
  isFeatured?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const queryString = queryParams.toString();
    return httpClient.get<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  async getFeaturedProducts(): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>('/products/featured');
  },

  async getProductById(id: string): Promise<ProductResponse> {
    return httpClient.get<ProductResponse>(`/products/${id}`);
  },

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    return httpClient.get<ProductResponse>(`/products/slug/${slug}`);
  },

  async searchProducts(query: string): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>(`/products/search?q=${encodeURIComponent(query)}`);
  },

  async getRelatedProducts(productId: string): Promise<{ success: boolean; message: string; data: Product[] }> {
    return httpClient.get<{ success: boolean; message: string; data: Product[] }>(`/products/${productId}/related`);
  },
};
