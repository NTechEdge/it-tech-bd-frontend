'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface Course {
  _id: string;
  title: string;
  shortDesc?: string;
  thumbnailUrl?: string;
  instructorName?: string;
  price: number;
  level?: string;
  rating?: number;
  studentsCount?: number;
}

interface TrendingCoursesSliderProps {
  courses: Course[];
}

export default function TrendingCoursesSlider({ courses }: TrendingCoursesSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [courses]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Trending Courses</h2>
          <p className="text-sm text-gray-600">Most popular courses this week</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-600 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              canScrollRight
                ? 'bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-600 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Courses Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course) => (
          <Link
            key={course._id}
            href={`/courses/${course._id}`}
            className="shrink-0 w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-linear-to-br from-orange-400 to-orange-600 overflow-hidden">
              {course.thumbnailUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                />
              )}
              {/* Trending Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                🔥 Trending
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {course.title}
              </h3>

              {course.shortDesc && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.shortDesc}</p>
              )}

              {/* Rating and Students */}
              <div className="flex items-center gap-3 mb-3">
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-yellow-400">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                  </div>
                )}
                {course.studentsCount && (
                  <span className="text-xs text-gray-500">{course.studentsCount.toLocaleString()} students</span>
                )}
              </div>

              {/* Price and Level */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {course.level && (
                  <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">
                    {course.level}
                  </span>
                )}
                <p className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
