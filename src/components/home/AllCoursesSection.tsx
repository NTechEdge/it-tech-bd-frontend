'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface Course {
  _id: string;
  title: string;
  shortDesc?: string;
  thumbnailUrl?: string;
  teacherName?: string;
  instructorName?: string; // For backward compatibility
  price: number;
  level?: string;
  rating?: number;
  category?: string;
}

interface AllCoursesSectionProps {
  courses: Course[];
}

export default function AllCoursesSection({ courses }: AllCoursesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter courses by category
  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))) as string[]];

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [filteredCourses]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth < 640 ? 280 : 320;
      const newScrollLeft =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="px-4 sm:px-0">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">All Courses</h2>
            <p className="text-xs sm:text-sm text-gray-600">Explore our complete course catalog</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white border border-gray-200 hover:border-[#0099ff]-500 hover:text-[#0099ff]-600 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <svg width="18" height="18" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white border border-gray-200 hover:border-[#0099ff] hover:text-[#0099ff] shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <svg width="18" height="18" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Tabs + View All Button */}
        <div className="flex items-center justify-between gap-4">
          {categories.length > 1 && (
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-linear-to-r from-[#003399] to-[#00d4ff] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0099ff] hover:text-[#0099ff]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          <Link
            href="/courses"
            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#0099ff]-500 hover:text-[#0099ff]-600 transition-colors font-medium text-xs sm:text-sm shrink-0 ml-auto"
          >
            View All
            <svg width="14" height="14" className="sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Courses Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredCourses.map((course) => (
          <Link
            key={course._id}
            href={`/courses/${course._id}`}
            className="shrink-0 w-[65vw] sm:w-72 snap-start bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
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
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shadow-sm">
                  {course.level}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[#0099ff] transition-colors" style={{ minHeight: '2.5rem' }}>
                {course.title}
              </h3>

              {/* Teacher - always reserve space for alignment */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 h-5 sm:h-6">
                {(course.teacherName || course.instructorName) ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-linear-to-br from-[#003399] to-[#00d4ff] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] sm:text-xs font-semibold">
                        {(course.teacherName || course.instructorName || '')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-600 truncate">
                      {course.teacherName || course.instructorName}
                    </span>
                  </>
                ) : null}
              </div>

              {/* Rating */}
              {course.rating && (
                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = course.rating || 0;
                      const isFilled = i < Math.ceil(ratingValue);
                      const isPartial = ratingValue > i && ratingValue < i + 1;
                      return (
                        <svg
                          key={i}
                          viewBox="0 0 24 24"
                          className={`${isFilled ? 'text-yellow-400' : 'text-gray-300'} w-2.5 h-2.5 sm:w-3 sm:h-3`}
                        >
                          {isPartial ? (
                            <defs>
                              <linearGradient id={`partial-${i}-${course._id}`}>
                                <stop offset={`${(ratingValue - i) * 100}%`} stopColor="currentColor" className="text-yellow-400" />
                                <stop offset={`${(ratingValue - i) * 100}%`} stopColor="currentColor" className="text-gray-300" stopOpacity={1} />
                              </linearGradient>
                            </defs>
                          ) : null}
                          <path
                            fill={isPartial ? `url(#partial-${i}-${course._id})` : (isFilled ? 'currentColor' : 'none')}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          />
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-900">{course.rating.toFixed(2)}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100">
                <span className="text-[10px] sm:text-xs text-gray-500">{course.category || 'Course'}</span>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `Tk ${course.price.toLocaleString()}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button - Mobile */}
      <div className="mt-4 sm:mt-6 text-center sm:hidden">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg hover:border-[#0099ff]-500 hover:text-[#0099ff]-600 transition-colors font-medium text-xs sm:text-sm"
        >
          View All Courses
          <svg width="14" height="14" className="sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
