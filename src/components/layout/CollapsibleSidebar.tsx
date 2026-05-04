"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface CollapsibleSidebarProps {
  navItems: NavItem[];
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  logoLink?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function CollapsibleSidebar({
  navItems,
  user,
  onLogout,
  logoLink = "/",
  collapsed: controlledCollapsed,
  onToggle,
}: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipItem, setTooltipItem] = useState<string | null>(null);
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
      }, 300);
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
        flex flex-col h-screen sticky top-0 left-0 shrink-0
        transition-all duration-500 ease-out
        ${effectiveCollapsed ? "w-20" : "w-72"}
        glassmorphism-sidebar
      `}
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(148, 163, 184, 0.1)",
      }}
    >
      {/* Gradient accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-violet-500 via-purple-500 to-fuchsia-500 rounded-r-full" />

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 shrink-0 relative">
        <Link href={logoLink} className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-10 h-10 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {!effectiveCollapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              IT-TECH-BD
            </span>
          )}
        </Link>

        {/* Collapse Toggle Button */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-200 group z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            className={`text-slate-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-slate-300">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-300 group
                    ${isActive
                      ? "text-white shadow-lg shadow-violet-500/25"
                      : "text-slate-600 hover:text-violet-600 hover:bg-white/50"
                    }
                    ${item.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
                  `}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
                        }
                      : {}
                  }
                  onMouseEnter={() => effectiveCollapsed && setTooltipItem(item.href)}
                  onMouseLeave={() => setTooltipItem(null)}
                >
                  {/* Icon */}
                  <span className={`
                    shrink-0 flex items-center justify-center w-10 h-10 rounded-lg
                    transition-all duration-300
                    ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600"
                    }
                  `}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${effectiveCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"}`}>
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && !effectiveCollapsed && (
                    <span className={`
                      px-2 py-0.5 text-xs font-semibold rounded-full
                      ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-violet-100 text-violet-600"
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && !effectiveCollapsed && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {effectiveCollapsed && tooltipItem === item.href && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in slide-in-from-left-1 duration-200">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="p-3 shrink-0 border-t border-slate-200/50">
          <div className={`
            relative overflow-hidden rounded-xl
            transition-all duration-300
            ${effectiveCollapsed ? "p-0" : "p-3 bg-linear-to-r from-violet-50 to-fuchsia-50 border border-violet-100"}
          `}>
            <div className={`
              flex items-center gap-3 transition-all duration-300
              ${effectiveCollapsed ? "justify-center" : ""}
            `}>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-full blur-md opacity-50" />
                <div className="relative w-10 h-10 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {user.avatar || user.name?.[0] || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>

              {/* User Info */}
              <div className={`flex-1 min-w-0 transition-all duration-300 ${effectiveCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && !effectiveCollapsed && (
              <button
                onClick={onLogout}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center">
        {!effectiveCollapsed && (
          <p className="text-[10px] text-slate-400">
            © 2026 IT-TECH-BD
          </p>
        )}
      </div>
    </aside>
  );
}
