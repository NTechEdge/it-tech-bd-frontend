"use client";

import { Course } from "../lib/courseData";

export interface CourseInfoProps {
  course: Course;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
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

export default function CourseInfo({ course }: CourseInfoProps) {
  return (
    <>
      {/* Course Header */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 py-5">
        <div className="flex items-start gap-3 mb-3">
          <StarRating rating={course.rating} />
          <span className="text-sm font-medium text-gray-700">{course.rating}</span>
          <span className="text-sm text-gray-500">({course.reviews} reviews)</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${course.badgeColor}`}>
            {course.level}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {course.title}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Instructor Bar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
            {course.instructor.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{course.instructor.name}</p>
            <p className="text-xs text-gray-500">{course.instructor.title}</p>
          </div>
        </div>
        <button className="group relative bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] hover:shadow-xl hover:shadow-blue-500/40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-200 overflow-hidden">
          <span className="relative z-10">Enroll Now — {course.price} TK</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </>
  );
}
