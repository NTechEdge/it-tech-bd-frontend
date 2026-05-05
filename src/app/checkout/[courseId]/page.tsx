import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getCourseById } from '@/lib/api/server';

// Force dynamic rendering for real-time pricing
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: { courseId: string } }
): Promise<Metadata> {
  try {
    const course = await getCourseById(params.courseId);

    return {
      title: `Checkout - ${course.title} | IT TECH BD`,
      description: `Complete your enrollment for ${course.title}`,
      robots: 'noindex, nofollow', // Don't index checkout pages
    };
  } catch {
    return {
      title: 'Checkout | IT TECH BD',
    };
  }
}

export default async function CheckoutPage({
  params,
}: {
  params: { courseId: string };
}) {
  // Handle params.courseId being an array
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  if (!courseId) {
    redirect('/courses');
  }

  const course = await getCourseById(courseId).catch(() => null);

  if (!course || !course.isActive) {
    notFound();
  }

  return <CheckoutClient course={course} courseId={courseId} />;
}
