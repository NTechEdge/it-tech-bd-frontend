"use client";

import { useEffect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchMyCourses, selectPurchasedCourseIds } from "@/lib/redux/slices/myCoursesSlice";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { purchasedCourses } = useAppSelector((state) => state.myCourses);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const purchasedCourseIds = purchasedCourses.map(course => course.product._id);

  // Filter products: for logged-in users, exclude purchased courses
  const availableProducts = isAuthenticated
    ? products.filter(product => !purchasedCourseIds.includes(product._id))
    : products;

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
    if (isAuthenticated) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
    <MainLayout variant="public">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isAuthenticated && purchasedCourseIds.length > 0
              ? "More Courses to Explore"
              : "Explore Our Courses"}
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Master in-demand skills with our comprehensive courses. Learn at your own pace,
            anytime, anywhere.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
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
          {isAuthenticated && purchasedCourseIds.length > 0 && (
            <div className="mt-8">
              <Link
                href="/my-courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View My Courses ({purchasedCourseIds.length})
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
              {isAuthenticated && purchasedCourseIds.length > 0
                ? "You've enrolled in all available courses!"
                : "No courses available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {isAuthenticated && purchasedCourseIds.length > 0
                ? "Check back later for new courses."
                : "Please check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableProducts.map((product) => (
              <Link
                key={product._id}
                href={`/courses/${product.slug || product._id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600">
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
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-orange-500">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{product.rating.average.toFixed(1)}</span>
                      <span>({product.rating.count})</span>
                    </div>
                    {product.duration && (
                      <div>
                        {Math.floor(product.duration / 60)}h {product.duration % 60}m
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm">
                      {product.category && (
                        <p className="font-semibold text-gray-900">{product.category.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {product.compareAtPrice && product.compareAtPrice > product.price ? (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 line-through">${product.compareAtPrice}</p>
                          <p className="text-xl font-bold text-orange-600">${product.price}</p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                      )}
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
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students already learning on our platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
    </MainLayout>
  );
}
