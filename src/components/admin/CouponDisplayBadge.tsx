interface CouponDisplayBadgeProps {
  couponCode?: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount: number;
}

export default function CouponDisplayBadge({
  couponCode,
  originalAmount,
  discountAmount,
  finalAmount,
}: CouponDisplayBadgeProps) {
  if (!couponCode) {
    return (
      <span className="text-sm font-medium text-gray-900">
        Tk {finalAmount.toLocaleString()}
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 line-through">
          Tk {(originalAmount ?? finalAmount).toLocaleString()}
        </span>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {couponCode}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">
          Tk {finalAmount.toLocaleString()}
        </span>
        {discountAmount && discountAmount > 0 && (
          <span className="text-xs text-green-600">
            (Saved Tk {discountAmount.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  );
}
