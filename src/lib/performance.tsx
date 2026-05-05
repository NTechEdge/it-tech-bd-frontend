/**
 * Performance optimization utilities
 * Collection of memoized components and performance hooks
 */

import Image from 'next/image';
import { memo, useMemo, useCallback, type ReactNode } from 'react';

/**
 * HOC to memoize components with custom comparison
 * Use for components that re-render often with same props
 */
export function memoize<P extends object>(
  Component: (props: P) => ReactNode,
  arePropsEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, arePropsEqual);
}

/**
 * Hook to memoize expensive computations
 * Use for filtering, sorting, or transforming large arrays
 */
export function useMemoizedList<T, R>(
  items: T[],
  transformer: (item: T) => R,
  deps: unknown[] = []
): R[] {
  return useMemo(() => items.map(transformer), [items, ...deps]);
}

/**
 * Hook to memoize filtered lists
 */
export function useFilteredList<T>(
  items: T[],
  predicate: (item: T) => boolean,
  deps: unknown[] = []
): T[] {
  return useMemo(() => items.filter(predicate), [items, ...deps]);
}

/**
 * Hook to memoize sorted lists
 */
export function useSortedList<T>(
  items: T[],
  compareFn: (a: T, b: T) => number,
  deps: unknown[] = []
): T[] {
  return useMemo(() => [...items].sort(compareFn), [items, ...deps]);
}

/**
 * Hook to create stable callback references
 * Prevents function recreation on every render
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: unknown[]
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Debounce hook for search inputs and other expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for scroll events and other高频 operations
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  ) as T;
}

import { useState, useEffect, useRef } from 'react';

/**
 * Memoized course card component to prevent unnecessary re-renders
 */
export const MemoizedCourseCard = memo(function CourseCard({
  course,
  onClick,
  isActive,
}: {
  course: {
    _id: string;
    title: string;
    thumbnailUrl?: string;
    teacherName?: string;
    instructorName?: string;
  };
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${
        isActive ? 'border-green-500' : 'border-gray-200 hover:shadow-lg cursor-pointer group'
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnailUrl ? (
          <Image
          width={40}
          height={40}
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-semibold">{course.title[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-gray-500">{course.teacherName || course.instructorName}</p>
      </div>
    </div>
  );
});

/**
 * Memoized stat card for dashboard metrics
 */
export const MemoizedStatCard = memo(function StatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-green-600">{change}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
});
