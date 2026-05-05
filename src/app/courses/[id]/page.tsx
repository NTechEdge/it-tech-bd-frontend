import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseClient from './CourseClient';
import { getCourseById, getCourses } from '@/lib/api/server';
import type { Course } from '@/lib/api/server';

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const course = await getCourseById(params.id);

    return {
      title: `${course.title} | IT TECH BD`,
      description: course.shortDesc,
      keywords: [
        course.category,
        course.level,
        course.teacherName || course.instructorName,
        'course',
        'training',
        'Bangladesh',
        'IT TECH BD'
      ].filter(Boolean).join(', '),
      openGraph: {
        title: course.title,
        description: course.shortDesc,
        images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: course.title,
        description: course.shortDesc,
        images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
      },
      alternates: {
        canonical: `/courses/${params.id}`,
      },
    };
  } catch {
    return {
      title: 'Course Not Found | IT TECH BD',
    };
  }
}

// Generate static params for static generation at build time
export async function generateStaticParams() {
  try {
    const response = await getCourses({ limit: 100 });
    const courses = Array.isArray(response.data)
      ? response.data
      : response.data?.courses || [];

    return courses.map((course: Course) => ({
      id: course._id,
    }));
  } catch {
    // Fallback to empty array if fetch fails
    return [];
  }
}

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourseById(params.id).catch(() => null);

  if (!course || !course.isActive) {
    notFound();
  }

  return <CourseClient course={course} courseId={params.id} />;
}
