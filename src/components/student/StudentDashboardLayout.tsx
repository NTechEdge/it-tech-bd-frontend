"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";
import NotificationBell from "@/components/ui/NotificationBell";
import Logo from "@/components/Logo";

const navItems = [
  {
    href: "/student/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/my-courses",
    label: "My Courses",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/certificates",
    label: "Certificates",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/help",
    label: "Help",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

interface StudentDashboardLayoutProps {
  children: ReactNode;
}

export default function StudentDashboardLayout({ children }: StudentDashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Professional Sidebar with names under icons */}
      <aside className={`
        flex flex-col h-screen sticky top-0 left-0 shrink-0 z-50
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-24" : "w-72"}
        border-r border-slate-200/60
      `}
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center px-4 shrink-0">
          <Link href="/student/dashboard" className="flex items-center gap-3 group">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <Logo width={sidebarCollapsed ? 32 : 40} height={sidebarCollapsed ? 32 : 40} className="relative rounded-lg" priority />
            </div>
            {!sidebarCollapsed && (
              <span className="text-base font-bold text-white tracking-tight">
                IT TECH BD
              </span>
            )}
          </Link>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 border border-slate-600"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              className={`text-slate-300 transition-transform duration-200 ${sidebarCollapsed ? "" : "-rotate-180"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation - Horizontal (icon + text side by side) */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-all duration-200 group
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <span className={`
                      shrink-0 flex items-center justify-center w-9 h-9 rounded-lg
                      transition-all duration-200
                      ${isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-800/50 text-slate-500 group-hover:bg-slate-700/50 group-hover:text-slate-300"
                      }
                    `}>
                      {item.icon}
                    </span>

                    {/* Label - hidden when collapsed */}
                    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-200 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Version Info */}
        {!sidebarCollapsed && (
          <div className="px-4 pb-4">
            <p className="text-[10px] text-slate-500 font-medium text-center">
              © 2026 IT TECH BD
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Learning Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || "Student"}!</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationBell />

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0] || "S"}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name || "Student"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || "student"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
