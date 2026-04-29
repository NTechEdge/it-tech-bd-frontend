"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMyCourses } from "@/lib/redux/slices/myCoursesSlice";
import CourseVideoView from "./components/CourseVideoView";

export default function MyCoursesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { enrolledCourses, loading, error } = useAppSelector((state) => state.myCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Only approved enrollments
  const approvedCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'approved'
  );

  const pendingCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'pending'
  );

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  useEffect(() => {
    if (approvedCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(approvedCourses[0].course._id);
    }
  }, [approvedCourses, selectedCourseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  // If a course is selected, show the video learning view
  if (selectedCourseId) {
    const selectedEnrolled = approvedCourses.find((ec) => ec.course._id === selectedCourseId);
    if (selectedEnrolled) {
      return (
        <CourseVideoView
          enrolledCourse={selectedEnrolled}
          allCourses={approvedCourses}
          onCourseChange={setSelectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      );
    }
  }

  // Course list view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">
          {approvedCourses.length} active course{approvedCourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Pending enrollments notice */}
      {pendingCourses.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-700 font-medium mb-1">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {pendingCourses.length} enrollment{pendingCourses.length !== 1 ? 's' : ''} pending approval
          </div>
          <p className="text-sm text-yellow-600">
            Your payment is being reviewed. You'll get access once approved.
          </p>
          <div className="mt-2 space-y-1">
            {pendingCourses.map((ec) => (
              <p key={ec.enrollment.id} className="text-sm text-yellow-700 font-medium">
                • {ec.course.title}
              </p>
            ))}
          </div>
        </div>
      )}

      {approvedCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No active courses yet</h3>
          <p className="text-gray-500 mb-6 text-sm">
            {pendingCourses.length > 0
              ? "Your enrollment is pending approval."
              : "Enroll in a course to start learning."}
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedCourses.map((ec) => {
            const totalLessons = ec.course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;
            const completedLessons = ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0;
            const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return (
              <div
                key={ec.enrollment.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedCourseId(ec.course._id)}
              >
                <div className="relative aspect-video overflow-hidden">
                  {ec.course.thumbnailUrl ? (
                    <img
                      src={ec.course.thumbnailUrl}
                      alt={ec.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Enrolled
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {ec.course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{ec.course.instructorName}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>{completedLessons}/{totalLessons} lessons</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                    {progressPct > 0 ? 'Continue Learning' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
