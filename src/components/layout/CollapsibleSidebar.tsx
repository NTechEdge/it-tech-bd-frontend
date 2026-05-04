"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";
import Logo from "@/components/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface CollapsibleSidebarProps {
  navItems: NavItem[];
  logoLink?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function CollapsibleSidebar({
  navItems,
  logoLink = "/",
  collapsed: controlledCollapsed,
  onToggle,
}: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // Auto-expand on hover when collapsed
  useEffect(() => {
    if (!collapsed) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let expandTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      expandTimeout = setTimeout(() => {
        setIsHovering(true);
      }, 200);
    };

    const handleMouseLeave = () => {
      clearTimeout(expandTimeout);
      setIsHovering(false);
    };

    sidebar.addEventListener("mouseenter", handleMouseEnter);
    sidebar.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      sidebar.removeEventListener("mouseenter", handleMouseEnter);
      sidebar.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(expandTimeout);
    };
  }, [collapsed]);

  const effectiveCollapsed = collapsed && !isHovering;

  return (
    <aside
      ref={sidebarRef}
      className={`
        flex flex-col h-screen sticky top-0 left-0 shrink-0 z-50
        transition-all duration-300 ease-in-out
        ${effectiveCollapsed ? "w-20" : "w-72"}
        border-r border-slate-200/60
      `}
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

      {/* Logo Section */}
      <div className={`h-16 flex items-center shrink-0 ${effectiveCollapsed ? "justify-center px-4" : "px-5"}`}>
        <Link href={logoLink} className={`flex items-center gap-3 group ${effectiveCollapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
            <Logo width={effectiveCollapsed ? 32 : 40} height={effectiveCollapsed ? 32 : 40} className="relative rounded-lg" priority />
          </div>
          {!effectiveCollapsed && (
            <span className="text-base font-bold text-white tracking-tight">
              IT TECH BD
            </span>
          )}
        </Link>

        {/* Collapse Button */}
        <button
          onClick={handleToggle}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 border border-slate-600"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            className={`text-slate-300 transition-transform duration-200 ${collapsed ? "" : "-rotate-180"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`
                    relative rounded-lg transition-all duration-200 group
                    ${effectiveCollapsed
                      ? "flex flex-col items-center justify-center px-1 py-2.5 gap-1"
                      : "flex items-center gap-3 px-3 py-2.5"
                    }
                    ${item.disabled
                      ? "opacity-40 cursor-not-allowed pointer-events-none"
                      : ""
                    }
                    ${isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }
                  `}
                >
                  {/* Active Indicator — only when expanded */}
                  {isActive && !effectiveCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <span className={`
                    shrink-0 flex items-center justify-center rounded-lg
                    transition-all duration-200
                    ${effectiveCollapsed ? "w-8 h-8" : "w-9 h-9"}
                    ${isActive
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-800/50 text-slate-500 group-hover:bg-slate-700/50 group-hover:text-slate-300"
                    }
                  `}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  {effectiveCollapsed ? (
                    <span className="text-[10px] font-medium text-center leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <span className="font-medium text-sm whitespace-nowrap flex-1">
                        {item.label}
                      </span>
                      {/* Badge */}
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-semibold rounded-md
                          ${isActive
                            ? "bg-blue-500 text-white"
                            : "bg-slate-700 text-slate-300"
                          }
                        `}>
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Version Info */}
      {!effectiveCollapsed && (
        <div className="px-4 pb-4">
          <p className="text-[10px] text-slate-500 font-medium">
            © 2026 IT TECH BD
          </p>
        </div>
      )}
    </aside>
  );
}
