"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// This route is now handled by the my-courses page with inline video view.
// Redirect to my-courses so the student can select the course there.
export default function CourseDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace("/student/dashboard/my-courses");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
