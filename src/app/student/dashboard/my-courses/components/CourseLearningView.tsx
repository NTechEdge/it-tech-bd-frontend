"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import CourseContent, { Lesson } from "./CourseContent";
import CourseInfo from "./CourseInfo";
import { allCourses, getCourseById, defaultCourseId } from "../lib/courseData";

export interface CourseLearningViewProps {
  courseId?: string;
}

export default function CourseLearningView({ courseId: initialCourseId = defaultCourseId }: CourseLearningViewProps) {
  const router = useRouter();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1");
  const [currentStartTime, setCurrentStartTime] = useState<number>(0);

  // Sync local state with prop when course changes from parent
  useEffect(() => {
    if (initialCourseId !== selectedCourseId) {
      setSelectedCourseId(initialCourseId);
      const course = getCourseById(initialCourseId);
      if (course) {
        const firstLesson = course.chapters[0].lessons[0];
        setSelectedLessonId(firstLesson.id);
        setCurrentStartTime(firstLesson.startTime);
      }
    }
  }, [initialCourseId]);

  // Get current course data
  const currentCourse = useMemo(() => {
    return getCourseById(selectedCourseId) || allCourses[0];
  }, [selectedCourseId]);

  // Find current lesson
  const currentLesson = useCallback(() => {
    for (const chapter of currentCourse.chapters) {
      const lesson = chapter.lessons.find(l => l.id === selectedLessonId);
      if (lesson) return lesson;
    }
    return currentCourse.chapters[0].lessons[0];
  }, [selectedLessonId, currentCourse]);

  const handleLessonClick = useCallback((lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setCurrentStartTime(lesson.startTime);
  }, []);

  const handleCourseChange = useCallback((newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    const course = getCourseById(newCourseId);
    if (course) {
      const firstLesson = course.chapters[0].lessons[0];
      setSelectedLessonId(firstLesson.id);
      setCurrentStartTime(firstLesson.startTime);
    }
  }, []);

  const handleBack = () => {
    router.push("/student/dashboard");
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors group"
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-gray-600 group-hover:text-gray-900 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Course Selector */}
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg px-4 py-2 pr-10 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {allCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Lesson {parseInt(selectedLessonId.split('-')[2] || selectedLessonId.split('-')[1])} of {currentCourse.chapters.reduce((a, c) => a + c.lessons.length, 0)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Notes
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Resources
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Q&A
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-450 mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer
                videoId={currentCourse.videoId}
                startTime={currentStartTime}
                title={currentCourse.title}
              />
              <CourseInfo course={currentCourse} />

              {/* Current Lesson Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Now Playing</h3>
                <p className="text-lg font-semibold text-orange-600 mb-2">{currentLesson().title}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentLesson().duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentLesson().completed ? 'Completed' : 'In Progress'}
                  </span>
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
