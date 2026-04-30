"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// This route now redirects to the proper course detail page under my-courses.
export default function CourseDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const courseId = params.id as string;
    router.replace(`/student/dashboard/my-courses/${courseId}`);
  }, [router, params]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#0099ff] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
