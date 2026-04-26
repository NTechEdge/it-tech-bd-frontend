import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">স্বাগতম</h1>
      <p className="text-gray-500 mb-6">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম।</p>
      <Link
        href="/student/dashboard/my-courses"
        className="inline-block bg-[#E8630A] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#d05a09] transition-colors"
      >
        আমার কোর্সসমূহ দেখুন
      </Link>
    </div>
  );
}
