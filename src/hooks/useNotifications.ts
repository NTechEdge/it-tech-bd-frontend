import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/lib/redux/slices/notificationsSlice';

export const useNotifications = (pollInterval: number = 60000) => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationsState = useSelector(
    (state: RootState) => state.notifications
  );

  // Provide default values to prevent undefined errors
  const notifications = notificationsState?.notifications ?? [];
  const unreadCount = notificationsState?.unreadCount ?? 0;
  const loading = notificationsState?.loading ?? false;
  const error = notificationsState?.error ?? null;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications on mount only
  useEffect(() => {
    dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  // Set up polling separately
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, pollInterval]);

  const markAsRead = useCallback((notificationId: string) => {
    return dispatch(markNotificationAsRead(notificationId));
  }, [dispatch]);

  const markAllAsReadFunc = useCallback(() => {
    return dispatch(markAllNotificationsAsRead());
  }, [dispatch]);

  const deleteNotificationFunc = useCallback((notificationId: string) => {
    return dispatch(deleteNotification(notificationId));
  }, [dispatch]);

  const refresh = useCallback(() => {
    return dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead: markAllAsReadFunc,
    deleteNotification: deleteNotificationFunc,
    refresh,
  };
};
