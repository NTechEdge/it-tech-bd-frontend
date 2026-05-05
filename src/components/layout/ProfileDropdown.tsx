"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  return (
    <div ref={ref} className="relative pl-4 border-l border-gray-200">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-lg hover:bg-gray-50 px-2 py-1.5 transition-colors"
        aria-label="Profile menu"
      >
        {user?.image ? (
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src={user.image}
              alt={user.name || "User"}
              fill
              className="rounded-full object-cover"
              sizes="36px"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shrink-0 text-sm">
            {user?.name?.[0] || "U"}
          </div>
        )}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || "User"}</p>
          <p className="text-xs text-gray-500 capitalize leading-tight">{user?.role || "user"}</p>
        </div>
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          className={`text-gray-400 hidden lg:block transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              {user?.image ? (
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shrink-0">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
