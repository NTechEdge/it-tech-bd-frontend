'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">Please log in to access this page.</div>
        <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-500">Your student dashboard</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <Link
        href="/student/dashboard/my-courses"
        className="inline-block bg-[#E8630A] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#d05a09] transition-colors"
      >
        My Courses
      </Link>
    </div>
  );
}
