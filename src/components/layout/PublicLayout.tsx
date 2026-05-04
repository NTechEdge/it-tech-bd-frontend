"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/courses",
    label: "Courses",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mobileSidebarOpenRef = useRef(mobileSidebarOpen);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Sync ref with state
  useEffect(() => {
    mobileSidebarOpenRef.current = mobileSidebarOpen;
  }, [mobileSidebarOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileSidebarOpenRef.current) {
      setMobileSidebarOpen(false);
    }
  }, [pathname]);

  // Close mobile sidebar on lg+ resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileSidebarOpenRef.current) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar with names under icons */}
      <aside className={`
        hidden lg:flex flex-col h-screen sticky top-0 left-0 shrink-0 z-50
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
          <Link href="/" className="flex items-center gap-3 group">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      relative rounded-lg transition-all duration-200 group
                      ${sidebarCollapsed
                        ? "flex flex-col items-center justify-center px-1 py-2.5 gap-1"
                        : "flex items-center gap-3 px-3 py-3"
                      }
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* Active Indicator — only when expanded */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <span className={`
                      shrink-0 flex items-center justify-center rounded-lg
                      transition-all duration-200
                      ${sidebarCollapsed ? "w-8 h-8" : "w-9 h-9"}
                      ${isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-800/50 text-slate-500 group-hover:bg-slate-700/50 group-hover:text-slate-300"
                      }
                    `}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    {sidebarCollapsed ? (
                      <span className="text-[10px] font-medium text-center leading-tight whitespace-nowrap">
                        {item.label}
                      </span>
                    ) : (
                      <span className="font-medium text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
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

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-white flex flex-col h-full shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
              aria-label="Close sidebar"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 mt-8">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="px-3 sm:px-4 lg:px-8">
            <div className="flex items-center h-14 sm:h-16 gap-2 sm:gap-3">
              {/* Hamburger — only on mobile/tablet */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                aria-label="Open sidebar"
              >
                <svg width="20" height="20" className="sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Right side - Auth Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {isAuthenticated ? (
                  <>
                    {/* Dashboard */}
                    <Link
                      href={user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700">Dashboard</span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-50 transition-colors group"
                    >
                      <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5 text-gray-600 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 group-hover:text-red-600">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all shadow-md"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Company Info */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Logo width={150} height={40} className="rounded-lg" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Empowering learners with quality IT courses and training programs.</p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Quick Links</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><Link href="/courses" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">Courses</Link></li>
                  <li><Link href="/about" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">About Us</Link></li>
                  <li><Link href="/contact" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">Contact</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Support</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><Link href="/help" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">Help Center</Link></li>
                  <li><Link href="/terms" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-xs sm:text-sm text-gray-600 hover:text-[#0099ff]-">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Contact Us</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>Email: support@it-tech-bd.com</li>
                  <li>Phone: +880 1234-567890</li>
                  <li>Dhaka, Bangladesh</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-8 text-center text-[10px] sm:text-xs text-gray-600">
              <p>&copy; 2026 IT TECH BD. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
