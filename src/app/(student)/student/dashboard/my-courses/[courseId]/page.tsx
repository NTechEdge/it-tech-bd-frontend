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
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const approvedCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'approved'
  );

  const selectedEnrolled = approvedCourses.find((ec) => ec.course._id === courseId);

  if (!selectedEnrolled) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">You may not have access to this course.</p>
          <button
            onClick={() => router.push('/student/dashboard/my-courses')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
      allCourses={approvedCourses}
      onCourseChange={(newCourseId) => router.push(`/student/dashboard/my-courses/${newCourseId}`)}
      onBack={() => router.push('/student/dashboard/my-courses')}
    />
  );
}
