"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMyCourses } from "@/lib/redux/slices/myCoursesSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function MyCoursesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { enrolledCourses, loading, error } = useAppSelector((state) => state.myCourses);

  const approvedCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'approved'
  );
  const pendingCourses = enrolledCourses.filter(
    (ec) => ec.enrollment.paymentStatus === 'pending'
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(fetchMyCourses());
  }, [dispatch, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Failed to load your courses</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen">
        <section className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Courses</h1>
                <p className="text-orange-100">
                  {approvedCourses.length} active {approvedCourses.length === 1 ? 'course' : 'courses'}
                </p>
              </div>
              <Link
                href="/courses"
                className="self-start sm:self-auto px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2 text-sm"
              >
                Browse More Courses
              </Link>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Pending notice */}
          {pendingCourses.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-medium text-yellow-700 mb-1">
                {pendingCourses.length} enrollment{pendingCourses.length !== 1 ? 's' : ''} pending approval
              </p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No active courses yet</h3>
              <p className="text-gray-500 mb-6 text-sm">
                {pendingCourses.length > 0
                  ? "Your enrollment is pending approval."
                  : "Enroll in a course to start learning."}
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:hover:shadow-lg hover:shadow-blue-500/40 transition-all shadow-lg"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedCourses.map((ec) => {
                const totalLessons = ec.course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;
                const completedLessons = ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0;
                const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return (
                  <div
                    key={ec.enrollment.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {ec.course.thumbnailUrl ? (
                        <img
                          src={ec.course.thumbnailUrl}
                          alt={ec.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center">
                          <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg">
                        Enrolled
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{ec.course.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{ec.course.instructorName}</p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{completedLessons}/{totalLessons} lessons</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] h-1.5 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Enrolled {new Date(ec.enrollment.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <Link
                          href="/student/dashboard/my-courses"
                          className="px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white text-sm font-semibold rounded-lg hover:hover:shadow-lg hover:shadow-blue-500/40 transition-all"
                        >
                          {progressPct > 0 ? 'Continue' : 'Start'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </PublicLayout>
  );
}
