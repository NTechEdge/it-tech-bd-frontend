"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProductById } from "@/lib/redux/slices/productsSlice";
import { fetchMyCourses, selectIsEnrolled, upsertEnrolledCourse } from "@/lib/redux/slices/myCoursesSlice";
import PublicLayout from "@/components/layout/PublicLayout";
import EnrollmentModal from "@/components/course/EnrollmentModal";

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  const courseId = params.id as string;
  const { currentProduct: course, loading, error } = useAppSelector((state) => state.products);
  const isEnrolled = useAppSelector((state) => selectIsEnrolled(state, courseId));
  const { enrolledCourses } = useAppSelector((state) => state.myCourses);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  // Check if there's a pending enrollment
  const pendingEnrollment = enrolledCourses.find(
    (ec) => ec.course._id === courseId && ec.enrollment.paymentStatus === 'pending'
  );

  const hasAccess = user?.role === 'admin' || isEnrolled;

  useEffect(() => {
    dispatch(fetchProductById(courseId));
    if (isAuthenticated) {
      dispatch(fetchMyCourses());
    }
  }, [courseId, isAuthenticated, dispatch]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTotalLessons = () =>
    course?.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;

  const getTotalDuration = () => {
    const total = course?.sections?.reduce(
      (acc, s) => acc + s.lessons.reduce((a, l) => a + (l.durationSeconds || 0), 0),
      0
    ) || 0;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !course) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <button onClick={() => router.push('/courses')} className="hover:text-white transition-colors">
                    Courses
                  </button>
                  <span>/</span>
                  <span className="text-orange-400">{course.category}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-300 mb-6">{course.shortDesc}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-orange-400">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    {course.instructorName}
                  </span>
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                    {course.level}
                  </span>
                  <span>{getTotalLessons()} lessons</span>
                  <span>{getTotalDuration()} total</span>
                </div>

                {hasAccess ? (
                  <button
                    onClick={() => router.push('/student/dashboard/my-courses')}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    Go to My Courses
                  </button>
                ) : pendingEnrollment ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl font-semibold">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    Payment Pending Approval
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) router.push(`/login?redirect=/courses/${courseId}`);
                      else setShowEnrollModal(true);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                  >
                    {isAuthenticated ? `Enroll Now — ৳${course.price.toLocaleString()}` : 'Login to Enroll'}
                  </button>
                )}
              </div>

              {/* Thumbnail */}
              <div className="lg:col-span-1">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <svg width="64" height="64" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  )}
                  {/* Lock overlay for non-enrolled */}
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" className="mx-auto mb-2 opacity-80">
                          <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                        </svg>
                        <p className="text-sm font-medium">Enroll to access</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.fullDesc}</p>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {course.sections?.length || 0} sections • {getTotalLessons()} lessons • {getTotalDuration()} total length
                </p>

                <div className="space-y-3">
                  {course.sections?.map((section, sIdx) => (
                    <div key={sIdx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(sIdx)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            className={`text-gray-500 transition-transform ${expandedSections.has(sIdx) ? 'rotate-90' : ''}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-semibold text-gray-900">{section.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{section.lessons.length} lessons</span>
                      </button>

                      {expandedSections.has(sIdx) && (
                        <div className="divide-y divide-gray-100">
                          {section.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-3">
                                {hasAccess ? (
                                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-orange-500 shrink-0">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-gray-400 shrink-0">
                                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                                  </svg>
                                )}
                                <span className="text-sm text-gray-700">{lesson.title}</span>
                              </div>
                              {lesson.durationSeconds > 0 && (
                                <span className="text-xs text-gray-500">{formatDuration(lesson.durationSeconds)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="text-3xl font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `৳${course.price.toLocaleString()}`}
                </div>

                {hasAccess ? (
                  <button
                    onClick={() => router.push('/student/dashboard/my-courses')}
                    className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    Continue Learning
                  </button>
                ) : pendingEnrollment ? (
                  <div className="w-full py-3 bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold rounded-xl text-center text-sm">
                    Awaiting Payment Approval
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) router.push(`/login?redirect=/courses/${courseId}`);
                      else setShowEnrollModal(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                  >
                    {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                  </button>
                )}

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-500 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{getTotalLessons()} lessons</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-500 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{getTotalDuration()} total length</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-500 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="text-orange-500 shrink-0">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span>{course.instructorName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEnrollModal && course && (
        <EnrollmentModal
          course={course}
          onClose={() => setShowEnrollModal(false)}
          onSuccess={(enrollment) => {
            setShowEnrollModal(false);
            dispatch(upsertEnrolledCourse({
              enrollment: {
                id: enrollment._id,
                purchasedAt: enrollment.purchasedAt,
                amount: enrollment.amount,
                paymentStatus: enrollment.paymentStatus,
                progress: enrollment.progress || [],
              },
              course,
            }));
            dispatch(fetchMyCourses());
          }}
        />
      )}
    </PublicLayout>
  );
}
