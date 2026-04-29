"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsEnrolled } from "@/lib/redux/slices/myCoursesSlice";

export function useEnrollment() {
  const { user, isAuthenticated } = useAuth();

  const isEnrolled = (courseId: string): boolean => {
    // This is a hook-level check — use selectIsEnrolled in components with useAppSelector
    return false;
  };

  const hasAccess = (courseId: string): boolean => {
    if (user?.role === 'admin') return true;
    return false;
  };

  return {
    isEnrolled,
    hasAccess,
    isAuthenticated,
    user,
  };
}

// Separate hook that uses Redux for enrollment check
export function useEnrollmentStatus(courseId: string) {
  const { user, isAuthenticated } = useAuth();
  const isEnrolled = useAppSelector((state) => selectIsEnrolled(state, courseId));

  const hasAccess = user?.role === 'admin' || isEnrolled;

  return { hasAccess, isEnrolled, isAuthenticated, user };
}
