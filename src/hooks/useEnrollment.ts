"use client";

import { useAuth } from "@/contexts/AuthContext";

export function useEnrollment() {
  const { user, isAuthenticated } = useAuth();

  const isEnrolled = (courseId: string): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return user.enrolledCourses?.includes(courseId) ?? false;
  };

  const hasAccess = (courseId: string): boolean => {
    // Admin users have access to all courses
    if (user?.role === 'admin') {
      return true;
    }
    return isEnrolled(courseId);
  };

  return {
    isEnrolled,
    hasAccess,
    isAuthenticated,
    user,
  };
}
