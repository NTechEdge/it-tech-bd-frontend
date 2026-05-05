import { Coupon } from "@/lib/api/couponService";

interface DeleteConfirmModalProps {
  coupon: Coupon;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ coupon, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Coupon?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the coupon <span className="font-semibold text-gray-900">{coupon.code}</span>?
            </p>

            {coupon.usedCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Warning:</strong> This coupon has been used {coupon.usedCount} time{coupon.usedCount > 1 ? "s" : ""}.
                  Deleting it will remove all usage history.
                </p>
              </div>
            )}

            {/* Coupon Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Discount:</span>
                  <p className="font-medium text-gray-900">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `৳${coupon.discountValue}`}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Scope:</span>
                  <p className="font-medium text-gray-900 capitalize">{coupon.scope}</p>
                </div>
                <div>
                  <span className="text-gray-500">Usage:</span>
                  <p className="font-medium text-gray-900">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium text-gray-900 capitalize">{coupon.status}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
