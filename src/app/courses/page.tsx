import { Metadata } from 'next';
import CoursesClient from './CoursesClient';
import { getCourses } from '@/lib/api/server';

// Force dynamic rendering for always-fresh data
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse Courses | IT TECH BD',
    description: 'Explore our comprehensive IT courses in web development, mobile development, data science, and more. Learn at your own pace with expert instructors.',
    keywords: 'IT courses, web development, mobile development, data science, programming, Bangladesh, IT TECH BD',
    openGraph: {
      title: 'Browse Courses | IT TECH BD',
      description: 'Explore our comprehensive IT courses and start learning today.',
      type: 'website',
    },
    alternates: {
      canonical: '/courses',
    },
  };
}

export default async function CoursesPage() {
  // Fetch courses server-side with a larger limit
  const coursesResponse = await getCourses({ page: 1, limit: 50 }).catch(() => null);

  const courses = coursesResponse
    ? (Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data?.courses || [])
    : [];

  return <CoursesClient initialCourses={courses} />;
}
