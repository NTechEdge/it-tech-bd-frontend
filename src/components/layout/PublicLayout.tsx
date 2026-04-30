"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState, useEffect } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on lg+ resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6  shrink-0">
        <Link href="/" className="flex items-center mt-6">
          <Logo width={200} height={50} className="" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-[#0099ff]"} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="font-medium flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Auth/User Section */}
      <div className="p-4  shrink-0">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white font-semibold shrink-0">
              {user.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || "user@example.com"}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              href="/login"
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full flex items-center gap-3 px-4 py-3 text-white bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-xl transition-all duration-200 font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
                

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-64 bg-[#292727] flex-col h-screen sticky top-0 left-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile/Tablet Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-[#292727] flex flex-col h-full shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close sidebar"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
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
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                aria-label="Open sidebar"
              >
                <svg width="20" height="20" className="sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Left spacer for balance on large screens */}
              <div className="hidden lg:block flex-1"></div>

              {/* Search Bar - responsive sizing */}
              <div className="flex-1 min-w-0 lg:flex-none lg:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400"
                  />
                  <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Right spacer for balance on large screens */}
              <div className="hidden lg:block flex-1"></div>

              {/* Right actions */}
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
              <p>&copy; 2026 IT-TECH-BD. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
