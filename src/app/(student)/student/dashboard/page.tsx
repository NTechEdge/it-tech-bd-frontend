'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchMyCourses } from '@/lib/redux/slices/myCoursesSlice';
import Link from 'next/link';
import { useEffect } from 'react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { enrolledCourses, loading } = useAppSelector((state) => state.myCourses);

  const approvedCourses = enrolledCourses.filter((ec) => ec.enrollment.paymentStatus === 'approved');
  const pendingCourses = enrolledCourses.filter((ec) => ec.enrollment.paymentStatus === 'pending');

  const totalLessons = approvedCourses.reduce(
    (acc, ec) => acc + (ec.course.sections?.reduce((a, s) => a + s.lessons.length, 0) || 0),
    0
  );
  const completedLessons = approvedCourses.reduce(
    (acc, ec) => acc + (ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0),
    0
  );
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Enrolled Courses</p>
          <p className="text-3xl font-bold text-gray-900">{approvedCourses.length}</p>
          {pendingCourses.length > 0 && (
            <p className="text-xs text-yellow-600 mt-1">{pendingCourses.length} pending approval</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Lessons Completed</p>
          <p className="text-3xl font-bold text-gray-900">{completedLessons}</p>
          <p className="text-xs text-gray-400 mt-1">of {totalLessons} total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Overall Progress</p>
          <p className="text-3xl font-bold text-orange-500">{overallProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent courses */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">My Courses</h2>
          <Link href="/student/dashboard/my-courses" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : approvedCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {pendingCourses.length > 0
                ? 'Your enrollment is pending approval.'
                : "You haven't enrolled in any courses yet."}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {approvedCourses.slice(0, 5).map((ec) => {
              const total = ec.course.sections?.reduce((a, s) => a + s.lessons.length, 0) || 0;
              const done = ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div key={ec.enrollment.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    {ec.course.thumbnailUrl ? (
                      <img src={ec.course.thumbnailUrl} alt={ec.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{ec.course.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{pct}%</span>
                    </div>
                  </div>
                  <Link
                    href={`/student/dashboard/my-courses/${ec.course._id}`}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    {pct > 0 ? 'Continue' : 'Start'}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/courses"
          className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-500 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Browse Courses</p>
            <p className="text-sm text-gray-500">Discover new courses</p>
          </div>
        </Link>

        <Link
          href="/student/dashboard/my-courses"
          className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-500 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Continue Learning</p>
            <p className="text-sm text-gray-500">Pick up where you left off</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
