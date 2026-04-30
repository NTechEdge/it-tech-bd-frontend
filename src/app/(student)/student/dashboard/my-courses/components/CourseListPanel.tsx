"use client";

import { useState } from "react";
import { CourseWithChapters } from "../lib/courseData";

export interface CourseListPanelProps {
  courses: CourseWithChapters[];
  selectedCourseId: string;
  onCourseSelect: (courseId: string) => void;
  onBack: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= rating ? "#F59E0B" : "#D1D5DB"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function CourseListPanel({ courses, selectedCourseId, onCourseSelect, onBack }: CourseListPanelProps) {
  const [activeTab, setActiveTab] = useState("All");

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes("redux")) return "🔷";
    if (title.toLowerCase().includes("react")) return "⚛️";
    if (title.toLowerCase().includes("javascript") || title.toLowerCase().includes("js")) return "💛";
    if (title.toLowerCase().includes("python")) return "🐍";
    if (title.toLowerCase().includes("web") || title.toLowerCase().includes("html")) return "🌐";
    if (title.toLowerCase().includes("docker")) return "🐳";
    if (title.toLowerCase().includes("aws")) return "☁️";
    return "📚";
  };

  const getIconBg = (title: string) => {
    if (title.toLowerCase().includes("redux")) return "bg-purple-100";
    if (title.toLowerCase().includes("react")) return "bg-blue-100";
    if (title.toLowerCase().includes("javascript") || title.toLowerCase().includes("js")) return "bg-yellow-100";
    if (title.toLowerCase().includes("python")) return "bg-green-100";
    if (title.toLowerCase().includes("docker")) return "bg-cyan-100";
    if (title.toLowerCase().includes("aws")) return "bg-blue-100";
    return "bg-gray-100";
  };

  const tabs = ["All", "InProgress", "Completed"];

  return (
    <div className="w-100 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Courses</h1>
            <p className="text-xs text-gray-500 mt-1">{courses.length} courses available</p>
          </div>
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourseId;
          const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
          const completedLessons = course.chapters.reduce(
            (acc, ch) => acc + ch.lessons.filter(l => l.completed).length,
            0
          );

          return (
            <button
              key={course.id}
              onClick={() => onCourseSelect(course.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[#0099ff] bg-blue-50 shadow-md"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-xl ${getIconBg(course.title)} flex items-center justify-center text-2xl shrink-0`}>
                  {getCourseIcon(course.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{course.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating rating={course.rating} />
                    <span className="text-xs text-gray-500">{course.rating} ({course.reviews})</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${course.badgeColor}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{completedLessons}/{totalLessons} lessons</span>
                      <span className="text-xs font-medium text-gray-700">
                        {Math.round((completedLessons / totalLessons) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-full transition-all duration-300"
                        style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
