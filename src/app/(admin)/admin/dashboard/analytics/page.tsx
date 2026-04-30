'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/lib/api/adminService';
import { AdminDashboardLoadingState } from '@/components/ui/loading-states';

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
  courseId: string;
  courseTitle: string;
  category: string;
  durationSeconds: number;
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const [overviewRes, lessonsRes, dashboardRes] = await Promise.all([
        adminService.getAllCoursesAnalytics(),
        adminService.getTopLessons(10),
        adminService.getDashboardStats(),
      ]);

      console.log('Analytics API Responses:', { overviewRes, lessonsRes, dashboardRes });

      if (overviewRes.success) {
        console.log('Overview data:', overviewRes.data);
        setOverview(overviewRes.data);
      } else {
        setError('Failed to load courses analytics');
      }

      if (lessonsRes.success) {
        console.log('Top lessons data:', lessonsRes.data);
        setTopLessons(lessonsRes.data);
      } else {
        setError('Failed to load top lessons');
      }

      if (dashboardRes.success) {
        console.log('Dashboard stats:', dashboardRes.data);
        setDashboardStats(dashboardRes.data);
      }
    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AdminDashboardLoadingState />;
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
  const totalEnrollments = dashboardStats?.stats?.totalEnrollments || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Platform-wide video and engagement analytics</p>
        </div>
        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className={loading ? 'animate-spin' : ''}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrollments', value: totalEnrollments, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Video Views', value: totalViews, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Completion Rate', value: `${avgCompletion}%`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Watch Time', value: formatTime(totalWatchTime), color: 'text-[#0099ff]', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stats Breakdown */}
      {dashboardStats && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{dashboardStats.stats.totalStudents}</p>
              <p className="text-sm text-gray-600 mt-1">Total Students</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{dashboardStats.stats.totalCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Total Courses</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{dashboardStats.stats.activeCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Active Courses</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{dashboardStats.stats.inactiveCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Inactive Courses</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-[#0099ff]">{dashboardStats.stats.totalEnrollments}</p>
              <p className="text-sm text-gray-600 mt-1">Total Enrollments</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{dashboardStats.stats.pendingPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Pending Payments</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{dashboardStats.stats.approvedPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Approved Payments</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{dashboardStats.stats.rejectedPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Rejected Payments</p>
            </div>
          </div>
        </div>
      )}

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
                        idx === 2 ? 'bg-blue-100 text-blue-700' :
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
                            className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] h-1.5 rounded-full"
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
