/**
 * Dynamic imports for code splitting
 * Import heavy components only when needed to reduce initial bundle size
 */

import dynamic from 'next/dynamic';

// Video player - 790 lines, load on demand
export const DynamicCustomVideoPlayer = dynamic(
  () => import('@/components/video/CustomVideoPlayer').then(mod => ({ default: mod.default })),
  {
    loading: () => (
      <div className="aspect-video bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading player...</div>
      </div>
    ),
    ssr: false, // Video player should only render on client
  }
);

// Admin components - load dynamically
export const DynamicCouponFormModal = dynamic(
  () => import('@/components/admin/coupons/CouponFormModal'),
  {
    loading: () => <div className="p-8 text-center">Loading form...</div>,
    ssr: true,
  }
);

// Admin dashboard pages - code split by route
export const DynamicAdminCoursesPage = dynamic(
  () => import('@/app/(admin)/admin/dashboard/courses/page'),
  {
    loading: () => <div>Loading courses...</div>,
    ssr: true,
  }
);

export const DynamicAdminStudentsPage = dynamic(
  () => import('@/app/(admin)/admin/dashboard/students/page'),
  {
    loading: () => <div>Loading students...</div>,
    ssr: true,
  }
);

export const DynamicAdminAnalyticsPage = dynamic(
  () => import('@/app/(admin)/admin/dashboard/analytics/page'),
  {
    loading: () => <div>Loading analytics...</div>,
    ssr: true,
  }
);

// Student dashboard components
export const DynamicCourseVideoView = dynamic(
  () => import('@/app/(student)/student/dashboard/my-courses/components/CourseVideoView'),
  {
    loading: () => <div>Loading course view...</div>,
    ssr: false,
  }
);

export const DynamicCourseLearningView = dynamic(
  () => import('@/app/(student)/student/dashboard/my-courses/components/CourseLearningView'),
  {
    loading: () => <div>Loading learning view...</div>,
    ssr: false,
  }
);

// Checkout page - load only when needed
export const DynamicCheckoutClient = dynamic(
  () => import('@/app/checkout/[courseId]/CheckoutClient'),
  {
    loading: () => <div>Loading checkout...</div>,
    ssr: false,
  }
);
