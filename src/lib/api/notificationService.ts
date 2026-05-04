import { httpClient } from '@/lib/utils/httpClient';

export type NotificationType =
  | 'payment_approved'
  | 'payment_rejected'
  | 'payment_pending'
  | 'course_published'
  | 'course_updated'
  | 'course_enrollment'
  | 'student_banned'
  | 'student_unbanned'
  | 'teacher_created'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationMetadata {
  courseId?: string;
  enrollmentId?: string;
  paymentId?: string;
  studentId?: string;
  teacherId?: string;
  [key: string]: any;
}

export interface Notification {
  _id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: NotificationMetadata;
  createdAt: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export const notificationService = {
  /**
   * Get notifications for the authenticated user
   */
  async getNotifications(params?: NotificationsParams): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    if (params?.type) queryParams.append('type', params.type);

    const response = await httpClient.get<NotificationsResponse>(
      `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return response;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return httpClient.get<{ count: number }>('/notifications/unread-count');
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<{ notification: Notification }> {
    return httpClient.patch<{ notification: Notification }>(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    return httpClient.patch<{ modifiedCount: number }>('/notifications/read-all');
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<{ notification: Notification }> {
    return httpClient.delete<{ notification: Notification }>(`/notifications/${notificationId}`);
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<{ deletedCount: number }> {
    return httpClient.delete<{ deletedCount: number }>('/notifications/read');
  }
};
