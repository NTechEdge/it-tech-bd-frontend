'use client';

import { useEffect, useState } from 'react';
import { adminService, Student } from '@/lib/api/adminService';
import { AdminTableLoadingState, AdminMobileListLoadingState } from '@/components/ui/loading-states';
import BanStudentModal from '@/components/admin/BanStudentModal';
import UnbanStudentModal from '@/components/admin/UnbanStudentModal';

type TabType = 'all' | 'banned';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Modal states
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadStudents();
  }, [currentPage, searchTerm, activeTab]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = activeTab === 'banned'
        ? await adminService.getBannedStudents({
            page: currentPage,
            limit: 10,
            search: searchTerm || undefined,
          })
        : await adminService.getStudents({
            page: currentPage,
            limit: 10,
            search: searchTerm || undefined,
          });

      if (response.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.pages);
        setTotal(response.data.pagination.total);
      } else {
        setError('Failed to load students');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadStudents();
  };

  const openBanModal = (student: Student) => {
    setSelectedStudent({ id: student._id, name: student.name });
    setBanModalOpen(true);
  };

  const openUnbanModal = (student: Student) => {
    setSelectedStudent({ id: student._id, name: student.name });
    setUnbanModalOpen(true);
  };

  const getBanStatus = (student: Student) => {
    if (!student.isBanned) return null;

    const isTemporary = student.banExpiresAt;
    const expiryDate = student.banExpiresAt ? new Date(student.banExpiresAt) : null;
    const isExpired = expiryDate && expiryDate < new Date();

    if (isExpired) {
      return { label: 'Ban Expired', color: 'bg-gray-100 text-gray-800' };
    }

    if (isTemporary) {
      return {
        label: `Banned until ${expiryDate?.toLocaleDateString()}`,
        color: 'bg-orange-100 text-orange-800'
      };
    }

    return { label: 'Permanently Banned', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-sm text-gray-600">
            Total {total} student{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-[#0099ff] text-[#0099ff]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Students
        </button>
        <button
          onClick={() => { setActiveTab('banned'); setCurrentPage(1); }}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'banned'
              ? 'border-[#0099ff] text-[#0099ff]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Banned Students
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ban Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <AdminTableLoadingState colSpan={6} message="Loading students..." />
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No students found</td></tr>
              ) : (
                students.map((student) => {
                  const banStatus = getBanStatus(student);
                  return (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>{student.isVerified ? 'Verified' : 'Pending'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {banStatus ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banStatus.color}`}>
                            {banStatus.label}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.isBanned ? (
                          <button
                            onClick={() => openUnbanModal(student)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium text-sm border border-green-200 shadow-sm hover:shadow"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => openBanModal(student)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm border border-red-200 shadow-sm hover:shadow"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-gray-100">
          {loading ? (
            <AdminMobileListLoadingState />
          ) : students.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">No students found</p>
          ) : (
            students.map((student) => {
              const banStatus = getBanStatus(student);
              return (
                <div key={student._id} className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        student.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{student.isVerified ? 'Verified' : 'Pending'}</span>
                      {banStatus && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${banStatus.color}`}>
                          {banStatus.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{student.email}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                    {student.isBanned ? (
                      <button
                        onClick={() => openUnbanModal(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium text-xs border border-green-200 shadow-sm"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => openBanModal(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-xs border border-red-200 shadow-sm"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Ban
                      </button>
                    )}
                  </div>
                </div>
              );
            })
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

      {/* Modals */}
      {selectedStudent && (
        <>
          <BanStudentModal
            isOpen={banModalOpen}
            onClose={() => { setBanModalOpen(false); setSelectedStudent(null); }}
            studentId={selectedStudent.id}
            studentName={selectedStudent.name}
            onSuccess={loadStudents}
          />
          <UnbanStudentModal
            isOpen={unbanModalOpen}
            onClose={() => { setUnbanModalOpen(false); setSelectedStudent(null); }}
            studentId={selectedStudent.id}
            studentName={selectedStudent.name}
            onSuccess={loadStudents}
          />
        </>
      )}
    </div>
  );
}
