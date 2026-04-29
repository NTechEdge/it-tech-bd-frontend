import { httpClient } from '@/lib/utils/httpClient';

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    images: Array<{ url: string; publicId: string }>;
    price: number;
    instructor?: {
      _id: string;
      name: string;
    };
    level?: string;
    duration?: number;
    rating: {
      average: number;
      count: number;
    };
  };
  name: string;
  thumbnail: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentDetails: {
    paymentMethod: string;
    status: string;
    paidAt: string;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MyOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export const ordersService = {
  async getMyOrders(params?: { page?: number; limit?: number; status?: string }): Promise<MyOrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    return httpClient.get<MyOrdersResponse>(`/orders/my${queryString ? `?${queryString}` : ''}`);
  },

  async getOrderById(id: string): Promise<OrderResponse> {
    return httpClient.get<OrderResponse>(`/orders/${id}`);
  },

  async getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
    return httpClient.get<OrderResponse>(`/orders/number/${orderNumber}`);
  },

  async cancelOrder(id: string, reason?: string): Promise<OrderResponse> {
    return httpClient.patch<OrderResponse>(`/orders/${id}/cancel`, { reason });
  },
};
