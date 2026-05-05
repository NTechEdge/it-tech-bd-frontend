import { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { getCourses } from '@/lib/api/server';

// ISR Configuration - Revalidate every 5 minutes for fresh content
export const revalidate = 300;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'IT TECH BD - Master Modern IT Skills',
    description: 'Learn web development, mobile development, data science, and more with expert instructors. Join thousands of students learning on IT TECH BD.',
    keywords: 'IT education, web development, mobile development, data science, Bangladesh, IT TECH BD, online courses',
    openGraph: {
      title: 'IT TECH BD - Master Modern IT Skills',
      description: 'Learn web development, mobile development, data science, and more with expert instructors.',
      type: 'website',
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function HomePage() {
  // Fetch courses server-side
  const coursesResponse = await getCourses({ page: 1, limit: 12 }).catch(() => null);

  const courses = coursesResponse
    ? (Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data?.courses || [])
    : [];

  // Pass raw courses to client - client will handle random data generation
  return <HomePageClient courses={courses} />;
}
