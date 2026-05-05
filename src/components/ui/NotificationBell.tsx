'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '@/lib/api/notificationService';
import { useNotifications } from '@/hooks/useNotifications';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-blue-500';
    case 'low':
      return 'bg-gray-400';
    default:
      return 'bg-blue-500';
  }
};

const getPriorityBorder = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-500';
    case 'high':
      return 'border-l-orange-500';
    case 'medium':
      return 'border-l-blue-500';
    case 'low':
      return 'border-l-gray-400';
    default:
      return 'border-l-blue-500';
  }
};

export default function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Safeguard: ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded-full ${getPriorityColor(safeNotifications[0]?.priority || 'medium')}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] sm:max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {safeNotifications.length === 0 ? (
              <div className="px-4 py-6 sm:py-8 text-center text-gray-500">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="mx-auto text-gray-400 mb-2 sm:mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-xs sm:text-sm">No notifications yet</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {safeNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getPriorityBorder(notification.priority)} ${notification.isRead ? 'opacity-60' : 'bg-blue-50/50'}`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* Icon based on type */}
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}>
                        {notification.type === 'payment_approved' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {notification.type === 'payment_rejected' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {notification.type === 'course_published' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-purple-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {notification.type === 'course_updated' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {notification.type === 'payment_pending' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-yellow-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {(notification.type === 'student_banned' || notification.type === 'student_unbanned') && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        {notification.type === 'teacher_created' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {notification.type === 'system' && (
                          <svg width="16" height="16" width-sm="20" height-sm="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 sm:gap-2">
                          <p className={`text-xs sm:text-sm font-medium truncate ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] sm:text-xs text-gray-500 shrink-0">{formatTime(notification.createdAt)}</span>
                        </div>
                        <p className={`text-xs sm:text-sm mt-0.5 line-clamp-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        {notification.actionLabel && (
                          <span className="text-[10px] sm:text-xs text-blue-600 mt-1 inline-block font-medium">
                            {notification.actionLabel} →
                          </span>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteNotification(e, notification._id)}
                        className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete notification"
                      >
                        <svg width="14" height="14" width-sm="16" height-sm="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {safeNotifications.length > 0 && (
            <div className="px-3 sm:px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  router.push('/notifications');
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
