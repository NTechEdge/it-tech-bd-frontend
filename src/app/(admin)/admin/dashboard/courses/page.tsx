'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService, Course } from '@/lib/api/adminService';

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [currentPage, searchTerm, categoryFilter, levelFilter]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCourses({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        level: levelFilter || undefined,
        includeInactive: true,
      });

      if (response.success) {
        setCourses(response.data.courses);
        setTotalPages(response.data.pagination.pages);
        setTotal(response.data.pagination.total);
      } else {
        setError('Failed to load courses');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await adminService.deleteCourse(id);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (course: Course) => {
    try {
      await adminService.updateCourse(course._id, { isActive: !course.isActive });
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  const categories = [...new Set(courses.map((c) => c.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-sm text-gray-600">
            Total {total} course{total !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => router.push('/admin/dashboard/courses/new')}          className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors"
        >
          + Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search courses..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900 placeholder-gray-400"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setLevelFilter('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No courses found</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={course.thumbnailUrl} alt={course.title} className="h-12 w-12 rounded object-cover mr-4 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{course.shortDesc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-800'
                        : course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>{course.level}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.price === 0 ? 'Free' : `TK${course.price.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleToggleActive(course)} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>{course.isActive ? 'Active' : 'Inactive'}</button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => router.push(`/admin/dashboard/courses/${course._id}`)} className="text-[#0099ff]-600 hover:text-[#0099ff]-900 font-medium">Edit</button>
                        <button onClick={() => handleDelete(course._id, course.title)} disabled={deletingId === course._id} className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50">
                          {deletingId === course._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">No courses found</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <img src={course.thumbnailUrl} alt={course.title} className="h-14 w-14 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{course.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{course.category} · {course.level}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{course.price === 0 ? 'Free' : `TK${course.price.toLocaleString()}`}</span>
                  <span>{course.sections.length} section{course.sections.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => handleToggleActive(course)} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>{course.isActive ? 'Active' : 'Inactive'}</button>
                </div>
                <div className="flex gap-4 pt-1">
                  <button onClick={() => router.push(`/admin/dashboard/courses/${course._id}`)} className="text-sm text-[#0099ff]-600 font-medium">Edit</button>
                  <button onClick={() => handleDelete(course._id, course.title)} disabled={deletingId === course._id} className="text-sm text-red-600 font-medium disabled:opacity-50">
                    {deletingId === course._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
