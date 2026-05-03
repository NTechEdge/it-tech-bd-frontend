"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchMyCourses } from "@/lib/redux/slices/myCoursesSlice";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import { CourseLoadingState } from "@/components/ui/loading-states";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { enrolledCourses } = useAppSelector((state) => state.myCourses);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const enrolledCourseIds = enrolledCourses
    .filter((ec) => ec.enrollment.paymentStatus === 'approved')
    .map((ec) => ec.course._id);

  const availableProducts = products;

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
    if (isAuthenticated) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <CourseLoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Failed to load courses</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Explore Our Courses
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto mb-6 sm:mb-8">
            Master in-demand skills with our comprehensive courses. Learn at your own pace,
            anytime, anywhere.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Certified Courses</span>
            </div>
          </div>

          {/* My Courses Link for Logged In Users */}
          {isAuthenticated && enrolledCourseIds.length > 0 && (
            <div className="mt-8">
              <Link
                href="/student/dashboard/my-courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0099ff] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View My Courses ({enrolledCourseIds.length})
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {availableProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600 mb-6">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableProducts.map((product) => (
              <Link
                key={product._id}
                href={`/courses/${product._id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-video bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] overflow-hidden">
                  {product.thumbnailUrl ? (
                    <Image
                      src={product.thumbnailUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff]">
                      <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  {/* Level Badge */}
                  {product.level && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gray-800/80">
                      {product.level}
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#0099ff] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.shortDesc}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-[#0099ff]">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-xs">{product.instructorName}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {product.price === 0 ? 'Free' : `$${product.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students already learning on our platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
              >
                Get Started for Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
    </PublicLayout>
  );
}
