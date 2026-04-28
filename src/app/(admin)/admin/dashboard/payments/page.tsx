'use client';

import { useEffect, useState } from 'react';
import { adminService, PaymentEnrollment } from '@/lib/api/adminService';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, [currentPage, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPayments({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      if (response.success) {
        setPayments(response.data.payments);
        setTotalPages(response.data.pagination.pages);
        setTotal(response.data.pagination.total);
      } else {
        setError('Failed to load payments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await adminService.approvePayment(id);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await adminService.rejectPayment(id);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject payment');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payments & Enrollments</h2>
          <p className="text-sm text-gray-600">
            Total {total} payment{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.userId.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.userId.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.courseId.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ৳{payment.courseId.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {payment.trxId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ৳{payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.paymentStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : payment.paymentStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.purchasedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.paymentStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(payment._id)}
                            disabled={processingId === payment._id}
                            className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                          >
                            {processingId === payment._id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(payment._id)}
                            disabled={processingId === payment._id}
                            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                          >
                            {processingId === payment._id ? '...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      {payment.paymentStatus === 'approved' && (
                        <span className="text-green-600">✓ Approved</span>
                      )}
                      {payment.paymentStatus === 'rejected' && (
                        <span className="text-red-600">✗ Rejected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
