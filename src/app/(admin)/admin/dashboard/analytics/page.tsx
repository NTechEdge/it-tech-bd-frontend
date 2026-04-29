'use client';

import { useEffect, useState } from 'react';
import { httpClient } from '@/lib/utils/httpClient';

interface CourseAnalytics {
  courseId: string;
  title: string;
  category: string;
  totalEnrolled: number;
  totalViews: number;
  totalCompleted: number;
  avgCompletionRate: number;
  avgWatchTimePerStudent: number;
  totalWatchTimeSeconds: number;
}

interface TopLesson {
  lessonId: string;
  title: string;
  courseTitle: string;
  category: string;
  totalViews: number;
  avgWatchTimeSeconds: number;
  completionRate: number;
}

interface AnalyticsOverview {
  totalCourses: number;
  courses: CourseAnalytics[];
}

interface TopLessonsData {
  total: number;
  topLessons: TopLesson[];
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topLessons, setTopLessons] = useState<TopLessonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, lessonsRes] = await Promise.all([
        httpClient.get<{ success: boolean; data: AnalyticsOverview }>('/admin/analytics/courses'),
        httpClient.get<{ success: boolean; data: TopLessonsData }>('/admin/analytics/top-lessons'),
      ]);
      if (overviewRes.success) setOverview(overviewRes.data);
      if (lessonsRes.success) setTopLessons(lessonsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
    );
  }

  const totalEnrolled = overview?.courses.reduce((a, c) => a + c.totalEnrolled, 0) || 0;
  const totalViews = overview?.courses.reduce((a, c) => a + c.totalViews, 0) || 0;
  const avgCompletion =
    overview && overview.courses.length > 0
      ? Math.round(overview.courses.reduce((a, c) => a + c.avgCompletionRate, 0) / overview.courses.length)
      : 0;
  const totalWatchTime = overview?.courses.reduce((a, c) => a + c.totalWatchTimeSeconds, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Platform-wide video and engagement analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrollments', value: totalEnrolled, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Video Views', value: totalViews, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Completion Rate', value: `${avgCompletion}%`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Watch Time', value: formatTime(totalWatchTime), color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Course analytics table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Course Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Course', 'Category', 'Enrolled', 'Views', 'Avg Completion', 'Watch Time'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!overview || overview.courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No analytics data yet. Students need to watch videos first.
                  </td>
                </tr>
              ) : (
                overview.courses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{course.title}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">{course.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {course.totalEnrolled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {course.totalViews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${course.avgCompletionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{course.avgCompletionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatTime(course.totalWatchTimeSeconds)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top lessons */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Top Lessons by Views</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Lesson', 'Course', 'Views', 'Avg Watch Time', 'Completion Rate'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!topLessons || topLessons.topLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No lesson views recorded yet.
                  </td>
                </tr>
              ) : (
                topLessons.topLessons.map((lesson, idx) => (
                  <tr key={lesson.lessonId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{lesson.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 max-w-xs truncate">{lesson.courseTitle}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {lesson.totalViews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatTime(lesson.avgWatchTimeSeconds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-orange-500 h-1.5 rounded-full"
                            style={{ width: `${lesson.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{lesson.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
