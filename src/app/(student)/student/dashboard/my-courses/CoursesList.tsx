"use client";

import { useEffect, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMyCourses } from "@/lib/redux/slices/myCoursesSlice";

const CoursesList = memo(function CoursesList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { enrolledCourses, loading, error } = useAppSelector((state) => state.myCourses);

  // Only approved enrollments - memoized to prevent recalculation
  const approvedCourses = useMemo(
    () => enrolledCourses.filter((ec) => ec.enrollment.paymentStatus === 'approved'),
    [enrolledCourses]
  );

  const pendingCourses = useMemo(
    () => enrolledCourses.filter((ec) => ec.enrollment.paymentStatus === 'pending'),
    [enrolledCourses]
  );

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  if (loading) {
    return null; // Skeleton will be shown by Suspense
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
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
            Your payment is being reviewed. You&apos;ll get access once approved.
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
            className="px-6 py-3 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          {/* Mobile layout: horizontal card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {approvedCourses.map((ec) => {
              const totalLessons = ec.course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;
              const completedLessons = ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0;
              const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
              const isBanned = ec.enrollment.courseBan?.isBanned;
              const banExpiry = ec.enrollment.courseBan?.banExpiresAt
                ? new Date(ec.enrollment.courseBan.banExpiresAt)
                : null;

              return (
                <div
                  key={ec.enrollment.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 active:scale-[0.98] ${
                    isBanned
                      ? 'border-red-200 opacity-80 cursor-not-allowed'
                      : 'border-gray-200 cursor-pointer'
                  }`}
                  onClick={() => !isBanned && router.push(`/student/dashboard/my-courses/${ec.course._id}`)}
                >
                  <div className="flex gap-0">
                    {/* Thumbnail strip */}
                    <div className="relative w-28 shrink-0">
                      {ec.course.thumbnailUrl ? (
                        <Image
                          src={ec.course.thumbnailUrl}
                          alt={ec.course.title}
                          width={112}
                          height={100}
                          className={`w-full h-full object-cover ${isBanned ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full min-h-[100px] bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center">
                          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                      {/* Play overlay */}
                      {!isBanned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                            <svg width="14" height="14" fill="#0099ff" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-bold text-sm leading-snug line-clamp-2 flex-1 ${isBanned ? 'text-gray-500' : 'text-gray-900'}`}>
                          {ec.course.title}
                        </h3>
                        {isBanned ? (
                          <span className="shrink-0 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded-md">Banned</span>
                        ) : (
                          <span className="shrink-0 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-md">Active</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2 truncate">{ec.course.teacherName || ec.course.instructorName}</p>

                      {isBanned ? (
                        <div className="text-xs text-red-600">
                          {ec.enrollment.courseBan?.banReason && (
                            <p className="line-clamp-1">Reason: {ec.enrollment.courseBan.banReason}</p>
                          )}
                          {banExpiry && <p className="text-red-400">Until: {banExpiry.toLocaleDateString()}</p>}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                            <span>{completedLessons}/{totalLessons} lessons</span>
                            <span className="font-semibold text-[#0099ff]">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] h-1.5 rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#0099ff] font-semibold mt-2">
                            {progressPct > 0 ? 'Continue →' : 'Start Learning →'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/tablet layout: grid cards */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedCourses.map((ec) => {
              const totalLessons = ec.course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;
              const completedLessons = ec.enrollment.progress?.filter((p) => p.isCompleted).length || 0;
              const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
              const isBanned = ec.enrollment.courseBan?.isBanned;
              const banExpiry = ec.enrollment.courseBan?.banExpiresAt
                ? new Date(ec.enrollment.courseBan.banExpiresAt)
                : null;

              return (
                <div
                  key={ec.enrollment.id}
                  className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${
                    isBanned
                      ? 'border-red-200 opacity-80 cursor-not-allowed'
                      : 'border-gray-200 hover:shadow-lg cursor-pointer group'
                  }`}
                  onClick={() => !isBanned && router.push(`/student/dashboard/my-courses/${ec.course._id}`)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {ec.course.thumbnailUrl ? (
                      <Image
                        src={ec.course.thumbnailUrl}
                        alt={ec.course.title}
                        width={400}
                        height={225}
                        className={`w-full h-full object-cover transition-transform duration-300 ${!isBanned ? 'group-hover:scale-105' : 'grayscale'}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center">
                        <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    {isBanned ? (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Access Restricted
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Enrolled
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className={`font-bold mb-1 line-clamp-2 transition-colors ${isBanned ? 'text-gray-500' : 'text-gray-900 group-hover:text-[#0099ff]'}`}>
                      {ec.course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{ec.course.teacherName || ec.course.instructorName}</p>

                    {isBanned ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                        <p className="font-semibold mb-0.5">Access restricted</p>
                        {ec.enrollment.courseBan?.banReason && (
                          <p className="text-red-600">Reason: {ec.enrollment.courseBan.banReason}</p>
                        )}
                        {banExpiry && (
                          <p className="text-red-500 mt-0.5">Until: {banExpiry.toLocaleDateString()}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
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
                        <button className="w-full py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all">
                          {progressPct > 0 ? 'Continue Learning' : 'Start Learning'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});

export default CoursesList;
