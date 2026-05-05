import { Suspense } from 'react';
import CoursesList from './CoursesList';
import CoursesListSkeleton from './CoursesListSkeleton';

export default function MyCoursesPage() {
  return (
    <Suspense fallback={<CoursesListSkeleton />}>
      <CoursesList />
    </Suspense>
  );
}
