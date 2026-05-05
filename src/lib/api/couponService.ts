import { httpClient } from '@/lib/utils/httpClient';

export type DiscountType = 'percentage' | 'fixed';
export type CouponScope = 'all' | 'specific' | 'category';
export type CouponStatus = 'active' | 'expired' | 'disabled';

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  scope: CouponScope;
  applicableCourses?: Array<{ _id: string; title: string; category: string; thumbnailUrl: string }>;
  applicableCategories?: string[];
  minPurchaseAmount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: { _id: string; name: string; email: string };
}

export interface CreateCouponData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  scope: CouponScope;
  applicableCourses?: string[];
  applicableCategories?: string[];
  minPurchaseAmount?: number;
  usageLimit: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
}

export interface UpdateCouponData extends Partial<CreateCouponData> {
  status?: CouponStatus;
}

export interface CouponValidationResult {
  isValid: boolean;
  reason?: string;
  coupon?: {
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    discountAmount: number;
    maxDiscountAmount?: number;
  };
  course?: {
    id: string;
    title: string;
    price: number;
  };
  pricing?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
  usageInfo?: {
    remainingUses: number;
    userRemainingUses: number;
  };
  alreadyEnrolled?: boolean;
}

export interface CouponApplicationResult {
  usageId: string;
  coupon: {
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    discountAmount: number;
  };
  pricing: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
}

export interface CouponStats {
  overview: {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
    disabledCoupons: number;
    totalUsageCount: number;
    totalUsageLimit: number;
  };
  usage: {
    totalUsage: number;
    totalDiscountAmount: number;
    totalOriginalAmount: number;
  };
  topCoupons: Array<{
    code: string;
    description: string;
    usageCount: number;
    totalDiscountAmount: number;
  }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CouponsResponse {
  success: boolean;
  data: {
    coupons: Coupon[];
    pagination: Pagination;
  };
}

export const couponService = {
  async getAllCoupons(params?: {
    page?: number;
    limit?: number;
    status?: CouponStatus;
    scope?: CouponScope;
    search?: string;
    sort?: string;
  }): Promise<CouponsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.scope) queryParams.append('scope', params.scope);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return httpClient.get(`/coupons${query ? `?${query}` : ''}`);
  },

  async getApplicableCoupons(courseId: string): Promise<{ success: boolean; data: { coupons: Array<{ code: string; description: string }> } }> {
    return httpClient.get(`/coupons/applicable?courseId=${courseId}`);
  },

  async getCouponById(id: string): Promise<{ success: boolean; data: Coupon }> {
    return httpClient.get(`/coupons/${id}`);
  },

  async createCoupon(data: CreateCouponData): Promise<{ success: boolean; message: string; data: Coupon }> {
    return httpClient.post('/coupons/', data);
  },

  async updateCoupon(id: string, data: UpdateCouponData): Promise<{ success: boolean; message: string; data: Coupon }> {
    return httpClient.put(`/coupons/${id}`, data);
  },

  async deleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
    return httpClient.delete(`/coupons/${id}`);
  },

  async validateCoupon(code: string, courseId: string, cartTotal?: number): Promise<{
    success: boolean;
    message: string;
    data: CouponValidationResult;
  }> {
    return httpClient.post('/coupons/validate', { code, courseId, cartTotal });
  },

  async applyCoupon(code: string, courseId: string): Promise<{
    success: boolean;
    message: string;
    data: CouponApplicationResult;
  }> {
    return httpClient.post('/coupons/apply', { code, courseId });
  },

  async getCouponStats(): Promise<{ success: boolean; data: CouponStats }> {
    return httpClient.get('/coupons/stats');
  },

  async generateCouponCode(length?: number): Promise<{ success: boolean; data: { code: string } }> {
    return httpClient.post('/coupons/generate-code', { length });
  }
};
