"use client";

import { useState, useCallback } from "react";
import { studentService } from "@/lib/api/studentService";
import { EnrolledCourse } from "@/lib/redux/slices/myCoursesSlice";

interface Props {
  enrolledCourse: EnrolledCourse;
  allCourses: EnrolledCourse[];
  onCourseChange: (courseId: string) => void;
  onBack: () => void;
}

export default function CourseVideoView({ enrolledCourse, allCourses, onCourseChange, onBack }: Props) {
  const { course, enrollment } = enrolledCourse;

  const allLessons = course.sections?.flatMap((s, sIdx) =>
    s.lessons.map((l, lIdx) => ({
      ...l,
      sectionTitle: s.title,
      sectionIndex: sIdx,
      lessonIndex: lIdx,
      lessonId: `${sIdx}-${lIdx}`,
    }))
  ) || [];

  const [selectedLessonId, setSelectedLessonId] = useState(allLessons[0]?.lessonId || '');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const currentLesson = allLessons.find((l) => l.lessonId === selectedLessonId) || allLessons[0];

  const isLessonCompleted = (lessonId: string) =>
    enrollment.progress?.some((p) => p.lessonId === lessonId && p.isCompleted) || false;

  const completedCount = enrollment.progress?.filter((p) => p.isCompleted).length || 0;
  const progressPct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleMarkComplete = useCallback(async () => {
    if (!currentLesson || updatingProgress) return;
    try {
      setUpdatingProgress(true);
      await studentService.updateProgress({
        courseId: course._id,
        lessonId: currentLesson.lessonId,
        watchTimeSeconds: currentLesson.durationSeconds || 0,
        isCompleted: true,
      });
      // Move to next lesson
      const currentIdx = allLessons.findIndex((l) => l.lessonId === selectedLessonId);
      if (currentIdx < allLessons.length - 1) {
        setSelectedLessonId(allLessons[currentIdx + 1].lessonId);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  }, [currentLesson, course._id, selectedLessonId, allLessons, updatingProgress]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {allCourses.length > 1 ? (
            <select
              value={course._id}
              onChange={(e) => onCourseChange(e.target.value)}
              className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer max-w-xs truncate"
            >
              {allCourses.map((ec) => (
                <option key={ec.course._id} value={ec.course._id}>
                  {ec.course.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm font-semibold text-gray-900 truncate max-w-xs">{course.title}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{progressPct}% complete</span>
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Video player */}
            <div className="relative bg-black aspect-video w-full rounded-xl overflow-hidden shadow-xl">
              <iframe
                key={currentLesson?.youtubeId}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentLesson?.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={currentLesson?.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{currentLesson?.sectionTitle}</p>
                  <h2 className="text-lg font-bold text-gray-900">{currentLesson?.title}</h2>
                  {currentLesson?.durationSeconds > 0 && (
                    <p className="text-sm text-gray-500 mt-1">{formatDuration(currentLesson.durationSeconds)}</p>
                  )}
                </div>
                <button
                  onClick={handleMarkComplete}
                  disabled={updatingProgress || isLessonCompleted(selectedLessonId)}
                  className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isLessonCompleted(selectedLessonId)
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
                  }`}
                >
                  {isLessonCompleted(selectedLessonId) ? '✓ Completed' : updatingProgress ? 'Saving...' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm">Course Content</h3>
            <p className="text-xs text-gray-500 mt-0.5">{completedCount}/{allLessons.length} lessons completed</p>
          </div>

          <div className="divide-y divide-gray-100">
            {course.sections?.map((section, sIdx) => (
              <div key={sIdx}>
                <button
                  onClick={() => toggleSection(sIdx)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      className={`text-gray-500 transition-transform shrink-0 ${expandedSections.has(sIdx) ? 'rotate-90' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-800 line-clamp-2">{section.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{section.lessons.length}</span>
                </button>

                {expandedSections.has(sIdx) && (
                  <div>
                    {section.lessons.map((lesson, lIdx) => {
                      const lessonId = `${sIdx}-${lIdx}`;
                      const isSelected = selectedLessonId === lessonId;
                      const isCompleted = isLessonCompleted(lessonId);

                      return (
                        <button
                          key={lIdx}
                          onClick={() => setSelectedLessonId(lessonId)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-orange-50 border-r-2 border-orange-500'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-green-500 border-green-500'
                              : isSelected
                              ? 'border-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {isCompleted && (
                              <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                            {isSelected && !isCompleted && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium line-clamp-2 ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                              {lesson.title}
                            </p>
                            {lesson.durationSeconds > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">{formatDuration(lesson.durationSeconds)}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
