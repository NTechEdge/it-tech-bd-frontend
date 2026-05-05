'use client';

import { useEffect, useState } from 'react';
import { adminService, PaymentEnrollment } from '@/lib/api/adminService';
import { AdminTableLoadingState, AdminMobileListLoadingState } from '@/components/ui/loading-states';
import CouponDisplayBadge from '@/components/admin/CouponDisplayBadge';

// Force dynamic rendering for real-time payment data
export const dynamic = 'force-dynamic';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  useEffect(() => {
    loadPayments();
  }, [currentPage, statusFilter]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payments & Enrollments</h2>
          <p className="text-sm text-gray-600">
            Total {total} payment{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white'
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
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <AdminTableLoadingState colSpan={7} message="Loading payments..." />
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No payments found</td></tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.userId.name}</div>
                      <div className="text-sm text-gray-500">{payment.userId.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.courseId.title}</div>
                      <div className="text-sm text-gray-500">TK{payment.courseId.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{payment.trxId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CouponDisplayBadge
                        couponCode={payment.couponCode}
                        originalAmount={payment.originalAmount}
                        discountAmount={payment.discountAmount}
                        finalAmount={payment.amount}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.paymentStatus === 'approved' ? 'bg-green-100 text-green-800'
                        : payment.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>{payment.paymentStatus}</span>
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
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/40 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{processingId === payment._id ? '...' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleReject(payment._id)}
                            disabled={processingId === payment._id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{processingId === payment._id ? '...' : 'Reject'}</span>
                          </button>
                        </div>
                      )}
                      {payment.paymentStatus === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approved
                        </span>
                      )}
                      {payment.paymentStatus === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet card list */}
        <div className="lg:hidden divide-y divide-gray-100">
          {loading ? (
            <AdminMobileListLoadingState />
          ) : payments.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">No payments found</p>
          ) : (
            payments.map((payment) => (
              <div key={payment._id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{payment.userId.name}</p>
                    <p className="text-xs text-gray-500">{payment.userId.email}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    payment.paymentStatus === 'approved' ? 'bg-green-100 text-green-800'
                    : payment.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>{payment.paymentStatus}</span>
                </div>
                <p className="text-sm text-gray-700">{payment.courseId.title}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono">{payment.trxId}</span>
                  <div className="text-right">
                    <CouponDisplayBadge
                      couponCode={payment.couponCode}
                      originalAmount={payment.originalAmount}
                      discountAmount={payment.discountAmount}
                      finalAmount={payment.amount}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(payment.purchasedAt).toLocaleDateString()}</span>
                  {payment.paymentStatus === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(payment._id)}
                        disabled={processingId === payment._id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/40 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{processingId === payment._id ? '...' : 'Approve'}</span>
                      </button>
                      <button
                        onClick={() => handleReject(payment._id)}
                        disabled={processingId === payment._id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{processingId === payment._id ? '...' : 'Reject'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-t-gray-200 flex items-center justify-between">
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
