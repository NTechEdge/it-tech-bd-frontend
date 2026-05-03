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

interface LocationStats {
  totalStudents: number;
  studentsWithAddress: number;
  studentsWithoutAddress: number;
  byDivision: Array<{ division: string; count: number }>;
  byDistrict: Array<{ division: string; district: string; count: number }>;
  byCity: Array<{ division: string; district: string; city: string; count: number }>;
}

interface EnrollmentByLocation {
  byDivision: Array<{ division: string; totalEnrollments: number; totalRevenue: number }>;
  byDistrict: Array<{ division: string; district: string; totalEnrollments: number; totalRevenue: number }>;
  byCity: Array<{ division: string; district: string; city: string; totalEnrollments: number; totalRevenue: number }>;
}

interface LocationReport {
  topDivisions: {
    byStudents: Array<{ division: string; studentCount: number }>;
    byRevenue: Array<{ division: string; totalRevenue: number; enrollmentCount: number }>;
  };
  recentStudents: Array<{
    _id: string;
    name: string;
    email: string;
    address?: { division?: string; district?: string; city?: string };
  }>;
  profileCompletion: {
    totalStudents: number;
    studentsWithCompleteProfile: number;
    completionRate: string;
  };
}

type AnalyticsTab = 'overview' | 'courses' | 'location';

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);
}

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topLessons, setTopLessons] = useState<TopLessonsData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [enrollmentByLocation, setEnrollmentByLocation] = useState<EnrollmentByLocation | null>(null);
  const [locationReport, setLocationReport] = useState<LocationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [activeTab]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'location') {
        const [statsRes, enrollmentRes, reportRes] = await Promise.all([
          adminService.getLocationStats(),
          adminService.getEnrollmentByLocation(),
          adminService.getLocationReport(),
        ]);

        if (statsRes.success) setLocationStats(statsRes.data);
        if (enrollmentRes.success) setEnrollmentByLocation(enrollmentRes.data);
        if (reportRes.success) setLocationReport(reportRes.data);
      } else {
        const [overviewRes, lessonsRes, dashboardRes] = await Promise.all([
          adminService.getAllCoursesAnalytics(),
          adminService.getTopLessons(10),
          adminService.getDashboardStats(),
        ]);

        if (overviewRes.success) setOverview(overviewRes.data);
        if (lessonsRes.success) setTopLessons(lessonsRes.data);
        if (dashboardRes.success) setDashboardStats(dashboardRes.data);
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

  if (error && !overview && !locationStats) {
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
          <p className="text-sm text-gray-500">Platform-wide analytics and insights</p>
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview' || activeTab === 'courses'
              ? 'border-[#0099ff] text-[#0099ff]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Course Analytics
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'location'
              ? 'border-[#0099ff] text-[#0099ff]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Location Analytics
        </button>
      </div>

      {(activeTab === 'overview' || activeTab === 'courses') && overview && (
        <>
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
                  {overview.courses.length === 0 ? (
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
          {topLessons && (
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
                    {topLessons.topLessons.length === 0 ? (
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
          )}
        </>
      )}

      {activeTab === 'location' && locationStats && enrollmentByLocation && locationReport && (
        <div className="space-y-6">
          {/* Location Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: locationStats.totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'With Address', value: locationStats.studentsWithAddress, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Without Address', value: locationStats.studentsWithoutAddress, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Profile Complete', value: locationReport.profileCompletion.completionRate, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Top Divisions by Students */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Top Divisions by Student Count</h3>
            </div>
            <div className="p-6">
              {locationReport.topDivisions.byStudents.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No location data available yet.</p>
              ) : (
                <div className="space-y-4">
                  {locationReport.topDivisions.byStudents.map((item, idx) => (
                    <div key={item.division} className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.division}</span>
                          <span className="text-sm font-semibold text-[#0099ff]">{item.studentCount} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] h-2 rounded-full"
                            style={{ width: `${(item.studentCount / locationReport.topDivisions.byStudents[0].studentCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Divisions by Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Top Divisions by Revenue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollmentByLocation.byDivision.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                        No enrollment data available yet.
                      </td>
                    </tr>
                  ) : (
                    enrollmentByLocation.byDivision.map((item) => (
                      <tr key={item.division} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.division}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.totalEnrollments}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(item.totalRevenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* District and City Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Districts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Top Districts</h3>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {locationStats.byDistrict.slice(0, 20).map((item, idx) => (
                      <tr key={`${item.division}-${item.district}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{item.district}</td>
                        <td className="px-4 py-2 text-sm font-medium text-[#0099ff]">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Cities */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Top Cities</h3>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {locationStats.byCity.slice(0, 20).map((item, idx) => (
                      <tr key={`${item.division}-${item.district}-${item.city}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{item.city}</td>
                        <td className="px-4 py-2 text-sm font-medium text-[#0099ff]">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Students with Location */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Recent Students with Location</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {locationReport.recentStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No students with location data yet.
                      </td>
                    </tr>
                  ) : (
                    locationReport.recentStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.address?.division || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.address?.district || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.address?.city || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
