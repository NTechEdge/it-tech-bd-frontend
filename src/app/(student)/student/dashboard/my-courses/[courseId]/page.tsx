"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMyCourses } from "@/lib/redux/slices/myCoursesSlice";
import CourseVideoView from "../components/CourseVideoView";

export default function CourseDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { enrolledCourses, loading } = useAppSelector((state) => state.myCourses);

  const courseId = params.courseId as string;

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-[#0099ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const approvedCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'approved'
  );

  const selectedEnrolled = enrolledCourses.find((ec) => ec.course._id === courseId);

  if (!selectedEnrolled) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">You may not have access to this course.</p>
          <button
            onClick={() => router.push('/student/dashboard/my-courses')}
            className="px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  // Show pending state for non-approved enrollments
  if (selectedEnrolled.enrollment.paymentStatus !== 'approved') {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-yellow-200 shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-yellow-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your enrollment for <span className="font-semibold">{selectedEnrolled.course.title}</span> is awaiting admin approval.
          </p>
          <p className="text-xs text-gray-400 mb-6">You'll get access to the course content once your payment is approved.</p>
          <button
            onClick={() => router.push('/student/dashboard/my-courses')}
            className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors text-sm font-medium"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  // Block access if student is banned from this course
  if (selectedEnrolled.enrollment.courseBan?.isBanned) {
    const banExpiry = selectedEnrolled.enrollment.courseBan.banExpiresAt
      ? new Date(selectedEnrolled.enrollment.courseBan.banExpiresAt)
      : null;
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4 text-sm">
            You have been banned from <span className="font-semibold">{selectedEnrolled.course.title}</span>.
          </p>
          {selectedEnrolled.enrollment.courseBan.banReason && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-left">
              <p className="text-xs font-semibold text-red-700 mb-0.5">Reason</p>
              <p className="text-sm text-red-600">{selectedEnrolled.enrollment.courseBan.banReason}</p>
            </div>
          )}
          {banExpiry && (
            <p className="text-xs text-gray-500 mb-4">
              Ban expires: <span className="font-medium">{banExpiry.toLocaleString()}</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mb-6">Contact support if you believe this is a mistake.</p>
          <button
            onClick={() => router.push('/student/dashboard/my-courses')}
            className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors text-sm font-medium"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseVideoView
      enrolledCourse={selectedEnrolled}
      allCourses={enrolledCourses.filter((ec) => ec.enrollment.paymentStatus === 'approved')}
      onCourseChange={(newCourseId) => router.push(`/student/dashboard/my-courses/${newCourseId}`)}
      onBack={() => router.push('/student/dashboard/my-courses')}
    />
  );
}
