"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          {user ? (
            <>
              Your account ({user.role}) does not have permission to access this page.
            </>
          ) : (
            "You need to be logged in to access this page."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user?.role === "student" && (
            <Link
              href="/student/dashboard"
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Student Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Admin Dashboard
            </Link>
          )}

          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        {!user && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Don't have an account?
            </p>
            <Link
              href="/login"
              className="text-orange-600 hover:text-orange-500 font-medium"
            >
              Sign in here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
