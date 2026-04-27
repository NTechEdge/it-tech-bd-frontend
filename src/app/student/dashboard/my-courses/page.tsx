"use client";

import { useState } from "react";
import CourseLearningView from "./components/CourseLearningView";
import CourseSelector from "./components/CourseSelector";
import CourseListPanel from "./components/CourseListPanel";
import { defaultCourseId, allCourses } from "./lib/courseData";

export default function MyCoursesPage() {
  const [viewMode, setViewMode] = useState<"select" | "learn">("select");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourseId);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setViewMode("learn");
  };

  const handleBackToSelector = () => {
    setViewMode("select");
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  return (
    <div className="flex h-full">
      {viewMode === "select" ? (
        <div className="flex-1 p-6 bg-linear-to-br from-gray-50 to-gray-100 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <CourseSelector
              selectedCourseId={selectedCourseId}
              onCourseSelect={handleCourseSelect}
            />
          </div>
        </div>
      ) : (
        <>
          <CourseListPanel
            courses={allCourses}
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseChange}
            onBack={handleBackToSelector}
          />
          <div className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100">
            <CourseLearningView courseId={selectedCourseId} />
          </div>
        </>
      )}
    </div>
  );
}
