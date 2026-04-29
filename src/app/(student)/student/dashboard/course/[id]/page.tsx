"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEnrollment } from "@/hooks/useEnrollment";
import VideoPlayer from "@/app/(student)/student/dashboard/my-courses/components/VideoPlayer";
import CourseContent, { Lesson } from "@/app/(student)/student/dashboard/my-courses/components/CourseContent";
import { allCourses, getCourseById } from "@/app/(student)/student/dashboard/my-courses/lib/courseData";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { hasAccess, isAuthenticated } = useEnrollment();

  const courseId = params.id as string;
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1");
  const [currentStartTime, setCurrentStartTime] = useState<number>(0);
  const [showCurriculum, setShowCurriculum] = useState(false);

  // Get current course data
  const currentCourse = useMemo(() => {
    return getCourseById(courseId) || allCourses[0];
  }, [courseId]);

  // Check if user has access
  const canAccess = hasAccess(courseId);

  // Initialize first lesson
  useEffect(() => {
    if (currentCourse?.chapters?.[0]?.lessons?.[0]) {
      const firstLesson = currentCourse.chapters[0].lessons[0];
      setSelectedLessonId(firstLesson.id);
      setCurrentStartTime(firstLesson.startTime);
    }
  }, [currentCourse]);

  // Find current lesson
  const currentLesson = useMemo(() => {
    for (const chapter of currentCourse.chapters) {
      const lesson = chapter.lessons.find(l => l.id === selectedLessonId);
      if (lesson) return lesson;
    }
    return currentCourse.chapters[0]?.lessons[0];
  }, [selectedLessonId, currentCourse]);

  const handleLessonClick = (lesson: Lesson) => {
    if (!canAccess) return;
    setSelectedLessonId(lesson.id);
    setCurrentStartTime(lesson.startTime);
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/student/dashboard/course/${courseId}`);
    } else {
      // TODO: Implement enrollment flow
      router.push(`/student/dashboard?enroll=${courseId}`);
    }
  };

  if (!currentCourse) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Course Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/student/dashboard/my-courses')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to My Courses</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Image/Thumbnail */}
          <div className="lg:w-2/5">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={`https://img.youtube.com/vi/${currentCourse.videoId}/maxresdefault.jpg`}
                alt={currentCourse.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                {currentCourse.badgeColor && (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-2 ${
                      currentCourse.badgeColor.includes('orange') ? 'bg-orange-500' :
                      currentCourse.badgeColor.includes('green') ? 'bg-green-500' :
                      currentCourse.badgeColor.includes('blue') ? 'bg-blue-500' :
                      'bg-gray-700'
                    }`}
                  >
                    {currentCourse.level}
                  </span>
                )}
                <h1 className="text-2xl font-bold text-white">{currentCourse.title}</h1>
              </div>

              {!canAccess && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" className="text-orange-500">
                        <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Enroll to unlock</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Info */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCourse.title}</h2>
                  <p className="text-gray-600">{currentCourse.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-200 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="font-bold">{currentCourse.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{currentCourse.reviews} reviews</p>
                </div>

                <div className="text-center">
                  <div className="text-gray-900 font-bold mb-1">{currentCourse.totalDuration}</div>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>

                <div className="text-center">
                  <div className="text-gray-900 font-bold mb-1">{currentCourse.chapters.length}</div>
                  <p className="text-xs text-gray-500">Chapters</p>
                </div>

                <div className="text-center">
                  <div className="text-gray-900 font-bold mb-1">
                    {currentCourse.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)}
                  </div>
                  <p className="text-xs text-gray-500">Lessons</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={currentCourse.instructor.avatar}
                      alt={currentCourse.instructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentCourse.instructor.name}</p>
                    <p className="text-xs text-gray-500">{currentCourse.instructor.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">${currentCourse.price}</p>
                  {!canAccess && (
                    <button
                      onClick={handleEnrollClick}
                      className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            videoId={currentCourse.videoId}
            startTime={currentStartTime}
            title={currentCourse.title}
            courseId={courseId}
            onEnrollClick={handleEnrollClick}
          />

          {/* Current Lesson Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">
              {canAccess ? "Now Playing" : "Preview"}
            </h3>
            <p className="text-lg font-semibold text-orange-600 mb-2">
              {currentLesson?.title || "Course Introduction"}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentLesson?.duration || "10:00"}
              </span>
              {!canAccess && (
                <span className="flex items-center gap-1 text-red-600">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                  </svg>
                  Enroll to unlock full course
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CourseContent
              chapters={currentCourse.chapters}
              selectedLessonId={selectedLessonId}
              onLessonClick={handleLessonClick}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
