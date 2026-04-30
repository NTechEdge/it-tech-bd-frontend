"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const navItems = [
  {
    href: "/student/dashboard/my-courses",
    label: " Courses",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/schedule",
    label: "Schedule",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/student/dashboard/downloads",
    label: "Downloads",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 3v13M7 11l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-18 bg-black flex flex-col items-center py-4 gap-1 shrink-0">
      {/* Logo */}
      <div className="w-10 h-10 mb-4 mt-6">
        <Logo width={40} height={40} className="" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 w-full py-3 px-1 rounded-lg transition-colors ${
                isActive
                  ? "text-[#E8630A] bg-white/10"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-medium leading-tight text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Exit */}
      <Link
        href="/login"
        className="flex flex-col items-center gap-1 text-white/40 hover:text-white/70 py-3 px-1 transition-colors"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-medium">Exit</span>
      </Link>
    </aside>
  );
}
