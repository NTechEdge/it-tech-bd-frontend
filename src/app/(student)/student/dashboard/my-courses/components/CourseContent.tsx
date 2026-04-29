"use client";

import { useState } from "react";
import { useEnrollment } from "@/hooks/useEnrollment";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  startTime: number;
  completed?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseContentProps {
  chapters: Chapter[];
  selectedLessonId: string;
  onLessonClick: (lesson: Lesson) => void;
  courseId: string;
}

export default function CourseContent({
  chapters,
  selectedLessonId,
  onLessonClick,
  courseId,
}: CourseContentProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(chapters.map(c => c.id)));
  const { hasAccess } = useEnrollment();

  const canAccess = hasAccess(courseId);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Course Content</h3>
            <p className="text-sm text-gray-500 mt-1">
              {chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)} lessons • {chapters.length} chapters
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Duration</p>
            <p className="text-sm font-semibold text-gray-900">4h 30m</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const completedLessons = chapter.lessons.filter(l => l.completed).length;

          return (
            <div key={chapter.id} className="transition-all duration-200">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    completedLessons === chapter.lessons.length
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {completedLessons === chapter.lessons.length ? (
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">{chapter.title}</p>
                    <p className="text-xs text-gray-500">{chapter.lessons.length} lessons</p>
                  </div>
                </div>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="bg-gray-50/50 px-4 pb-3">
                  <div className="space-y-1">
                    {chapter.lessons.map((lesson, index) => {
                      const isSelected = lesson.id === selectedLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onLessonClick(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            isSelected
                              ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                              : 'hover:bg-white hover:shadow-md bg-white/50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                            isSelected ? 'bg-white/20' : lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {lesson.completed ? (
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-sm font-medium truncate transition-colors ${
                              isSelected ? 'text-white' : 'text-gray-800'
                            }`}>
                              {lesson.title}
                            </p>
                          </div>

                          <span className={`text-xs font-medium shrink-0 transition-colors ${
                            isSelected ? 'text-white/90' : 'text-gray-500'
                          }`}>
                            {formatTime(lesson.startTime)}
                          </span>

                          {/* Lock icon for non-enrolled users */}
                          {!canAccess && (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isSelected ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-red-100'
                            }`}>
                              <svg
                                width="14"
                                height="14"
                                fill={isSelected ? "white" : "currentColor"}
                                viewBox="0 0 24 24"
                                className={isSelected ? '' : 'text-gray-500 group-hover:text-red-600'}
                              >
                                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                              </svg>
                            </div>
                          )}

                          {/* Play icon for enrolled users */}
                          {canAccess && (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isSelected ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-orange-100'
                            }`}>
                              <svg
                                width="14"
                                height="14"
                                fill={isSelected ? "white" : "currentColor"}
                                viewBox="0 0 24 24"
                                className={isSelected ? '' : 'text-gray-500 group-hover:text-orange-600'}
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
