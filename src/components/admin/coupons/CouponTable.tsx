import { Coupon } from "@/lib/api/couponService";

interface CouponTableProps {
  coupons: Coupon[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  onPageChange: (page: number) => void;
}

export default function CouponTable({
  coupons,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange
}: CouponTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      disabled: "bg-gray-100 text-gray-800"
    };
    return styles[status as keyof typeof styles] || styles.disabled;
  };

  const getScopeBadge = (scope: string) => {
    const styles = {
      all: "bg-blue-100 text-blue-800",
      specific: "bg-purple-100 text-purple-800",
      category: "bg-orange-100 text-orange-800"
    };
    return styles[scope as keyof typeof styles] || styles.all;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099ff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="mt-2">No coupons found</p>
                  <p className="text-sm">Create your first coupon to get started</p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `৳${coupon.discountValue}`}
                      </span>
                      {coupon.discountType === "percentage" && coupon.maxDiscountAmount && (
                        <span className="text-gray-500 text-xs ml-1">
                          (max ৳{coupon.maxDiscountAmount})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getScopeBadge(coupon.scope)}`}>
                      {coupon.scope === "all" ? "All Courses" : coupon.scope === "specific" ? "Specific" : "Category"}
                    </span>
                    {coupon.scope === "specific" && coupon.applicableCourses && (
                      <div className="text-xs text-gray-500 mt-1">
                        {coupon.applicableCourses.length} course{coupon.applicableCourses.length > 1 ? "s" : ""}
                      </div>
                    )}
                    {coupon.scope === "category" && coupon.applicableCategories && (
                      <div className="text-xs text-gray-500 mt-1">
                        {coupon.applicableCategories.join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{coupon.perUserLimit} per user</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{formatDate(coupon.validFrom)}</div>
                      <div className="text-gray-500">to {formatDate(coupon.validUntil)}</div>
                    </div>
                    {isExpired(coupon.validUntil) && (
                      <span className="text-xs text-red-600">Expired</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(coupon.status)}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(coupon)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} coupons
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                    pagination.page === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
