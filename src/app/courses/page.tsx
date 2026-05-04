"use client";

import { useEffect, useState } from "react";
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

  const [search, setSearch] = useState("");

  const enrolledCourseIds = enrolledCourses
    .filter((ec) => ec.enrollment.paymentStatus === "approved")
    .map((ec) => ec.course._id);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.instructorName || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
    if (isAuthenticated) dispatch(fetchMyCourses());
  }, [dispatch, isAuthenticated]);

  if (loading) return <CourseLoadingState />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Failed to load courses</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <section className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              Explore Our Courses
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl mb-5 sm:mb-7">
              Master in-demand skills. Learn at your own pace, anytime, anywhere.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 placeholder-blue-200 text-white border border-white/30 focus:outline-none focus:bg-white/30 text-sm"
              />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 text-sm text-blue-100">
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                Expert Instructors
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                Lifetime Access
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                Certified Courses
              </span>
            </div>

            {isAuthenticated && enrolledCourseIds.length > 0 && (
              <div className="mt-5">
                <Link
                  href="/student/dashboard/my-courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0099ff] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-sm"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  My Courses ({enrolledCourseIds.length})
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── Course list ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500 text-sm">
                {search ? `No results for "${search}"` : "Please check back later."}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="mt-4 text-[#0099ff] text-sm font-medium hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{filtered.length} course{filtered.length !== 1 ? "s" : ""}</p>

              {/* Mobile: vertical list cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {filtered.map((product) => {
                  const enrolled = enrolledCourseIds.includes(product._id);
                  return (
                    <Link
                      key={product._id}
                      href={`/courses/${product._id}`}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm active:scale-[0.98] transition-transform flex"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-28 shrink-0 bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff]">
                        {product.thumbnailUrl ? (
                          <Image src={product.thumbnailUrl} alt={product.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        {enrolled && (
                          <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug flex-1">
                            {product.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 truncate mb-1.5">{product.instructorName}</p>
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          {product.level && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">
                              {product.level}
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-gray-900">
                            {product.price === 0 ? "Free" : `Tk ${product.price.toLocaleString()}`}
                          </span>
                          {enrolled ? (
                            <span className="text-[11px] text-green-600 font-semibold">Enrolled</span>
                          ) : (
                            <span className="text-[11px] text-[#0099ff] font-semibold">View</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop/tablet: grid cards */}
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => {
                  const enrolled = enrolledCourseIds.includes(product._id);
                  return (
                    <Link
                      key={product._id}
                      href={`/courses/${product._id}`}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative aspect-video bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] overflow-hidden">
                        {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        {product.level && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-gray-800/80">
                            {product.level}
                          </div>
                        )}
                        {enrolled && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                            <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                            Enrolled
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-2 group-hover:text-[#0099ff] transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.shortDesc}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-[#0099ff]">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          {product.instructorName}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{product.category}</span>
                          <span className="text-xl font-bold text-gray-900">
                            {product.price === 0 ? "Free" : `Tk ${product.price.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </main>

        {/* ── CTA for guests ── */}
        {!isAuthenticated && (
          <section className="bg-gray-900 text-white py-12 sm:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Start Learning?</h2>
              <p className="text-gray-300 mb-7 text-sm sm:text-base">
                Join thousands of students already learning on our platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className=" sm:w-auto px-8 py-3 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all text-center"
                >
                  Get Started for Free
                </Link>
                <Link
                  href="/login"
                  className=" sm:w-auto px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all text-center"
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
