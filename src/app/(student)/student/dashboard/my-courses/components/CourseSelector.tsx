"use client";

import { allCourses } from "../lib/courseData";

export interface CourseSelectorProps {
  selectedCourseId: string;
  onCourseSelect: (courseId: string) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#F59E0B" : "#E5E7EB"}
          className="transition-colors duration-200"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function CourseSelector({ selectedCourseId, onCourseSelect }: CourseSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Select a Course</h2>
        <span className="text-sm text-gray-500">{allCourses.length} courses available</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCourses.map((course) => {
          const isSelected = course.id === selectedCourseId;
          const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

          return (
            <button
              key={course.id}
              onClick={() => onCourseSelect(course.id)}
              className={`group relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[#0099ff] bg-blue-50 shadow-lg shadow-blue-200"
                  : "border-gray-200 bg-white hover:border-[#0099ff] hover:shadow-md"
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#0099ff] flex items-center justify-center">
                  <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              )}

              {/* Course Badge */}
              <div className="inline-block mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${course.badgeColor}`}>
                  {course.level}
                </span>
              </div>

              {/* Course Title */}
              <h3 className={`font-bold mb-2 pr-8 ${isSelected ? 'text-[#0099ff]-700' : 'text-gray-900 group-hover:text-[#0099ff]-600'}`}>
                {course.title}
              </h3>

              {/* Course Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <StarRating rating={course.rating} />
                  <span className="text-gray-600">{course.rating}</span>
                  <span className="text-gray-400">({course.reviews})</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.totalDuration}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white text-xs font-bold">
                  {course.instructor.avatar}
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-gray-900">{course.instructor.name}</p>
                  <p className="text-xs text-gray-500">{course.instructor.title}</p>
                </div>
                <div className="ml-auto font-semibold text-[#0099ff]-600">
                  ৳{course.price}
                </div>
              </div>

              {/* Hover Gradient Effect */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
