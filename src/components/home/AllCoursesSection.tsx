'use client';

import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  shortDesc?: string;
  thumbnailUrl?: string;
  instructorName?: string;
  price: number;
  level?: string;
  rating?: number;
  category?: string;
}

interface AllCoursesSectionProps {
  courses: Course[];
}

export default function AllCoursesSection({ courses }: AllCoursesSectionProps) {
  if (courses.length === 0) return null;

  // Group courses by category if available, otherwise show all
  const hasCategories = courses.some(c => c.category);
  const categories = hasCategories
    ? Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))
    : ['All Courses'];

  return (
    <div className="px-4 sm:px-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">All Courses</h2>
          <p className="text-sm text-gray-600">Explore our complete course catalog</p>
        </div>
        <Link
          href="/courses"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors font-medium text-sm"
        >
          View All
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Categories Tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                index === 0
                  ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            href={`/courses/${course._id}`}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
              {course.thumbnailUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                />
              )}
              {/* Level Badge */}
              {course.level && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-lg shadow-sm">
                  {course.level}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {course.title}
              </h3>

              {/* Instructor */}
              {course.instructorName && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{course.instructorName[0]}</span>
                  </div>
                  <span className="text-xs text-gray-600">{course.instructorName}</span>
                </div>
              )}

              {/* Rating */}
              {course.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="12"
                        height="12"
                        fill={i < Math.floor(course.rating!) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        className={i < Math.floor(course.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-900">{course.rating}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">{course.category || 'Course'}</span>
                <p className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button - Mobile */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors font-medium"
        >
          View All Courses
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
