"use client";

import React from "react";

interface LockedVideoPlaceholderProps {
  courseTitle: string;
  onEnrollClick: () => void;
  isAuthenticated: boolean;
}

export default function LockedVideoPlaceholder({
  courseTitle,
  onEnrollClick,
  isAuthenticated,
}: LockedVideoPlaceholderProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 aspect-video w-full rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0099ff]/10 via-transparent to-purple-500/10 animate-pulse"></div>

      {/* Lock Icon with Glow */}
      <div className="relative z-10 text-center">
        <div className="relative inline-block mb-6">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[#0099ff] blur-3xl opacity-20 animate-pulse"></div>

          {/* Lock Container */}
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <svg
              width="56"
              height="56"
              fill="white"
              viewBox="0 0 24 24"
              className="drop-shadow-lg"
            >
              <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
            </svg>
          </div>

          {/* Ring Animation */}
          <div className="absolute inset-0 border-4 border-[#0099ff]/30 rounded-full animate-ping"></div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          {isAuthenticated ? "Enroll to Continue" : "Course Locked"}
        </h3>

        <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
          {isAuthenticated
            ? "Enroll in this course to unlock all lessons and start your learning journey."
            : "Please sign in to enroll in this course and access all lessons."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onEnrollClick}
            className="px-8 py-3 bg-gradient-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5"
          >
            {isAuthenticated ? "Enroll Now" : "Sign In to Enroll"}
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => window.location.href = "/register"}
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
}
