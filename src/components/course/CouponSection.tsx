"use client";

import { useState } from "react";
import { couponService, CouponValidationResult } from "@/lib/api/couponService";

interface CouponSectionProps {
  courseId: string;
  originalPrice: number;
  onCouponApplied: (result: CouponValidationResult) => void;
  onCouponRemoved: () => void;
}

export default function CouponSection({
  courseId,
  originalPrice,
  onCouponApplied,
  onCouponRemoved,
}: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [error, setError] = useState("");

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    // Check if courseId exists
    if (!courseId) {
      setError("Course information is missing. Please try again or contact support.");
      return;
    }

    try {
      setValidating(true);
      setError("");

      const response = await couponService.validateCoupon(couponCode.trim(), courseId, originalPrice);

      if (response.success && response.data.isValid) {
        setAppliedCoupon(response.data);
        onCouponApplied(response.data);
        setError("");
      } else {
        setError(response.message || response.data.reason || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to validate coupon";
      setError(errorMessage);
      setAppliedCoupon(null);
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError("");
    onCouponRemoved();
  };

  const formatPrice = (amount: number) => `Tk ${amount.toLocaleString()}`;

  return (
    <div className="space-y-3">
      {!appliedCoupon ? (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Have a coupon code?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Enter coupon code"
              className={`flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent bg-white ${
                error ? "border-red-300" : "border-gray-300"
              }`}
              disabled={validating}
            />
            <button
              type="button"
              onClick={handleValidateCoupon}
              disabled={validating || !couponCode.trim()}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {validating ? "..." : "Apply"}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm flex items-center gap-1">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="text-green-600">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span className="font-semibold text-green-800">Coupon Applied!</span>
              </div>
              <p className="text-sm font-medium text-green-700">{appliedCoupon.coupon?.code}</p>
              <p className="text-xs text-green-600 mt-0.5">{appliedCoupon.coupon?.description}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-900 text-sm font-medium underline"
            >
              Remove
            </button>
          </div>

          {/* Discount Breakdown */}
          {appliedCoupon.pricing && (
            <div className="mt-3 pt-3 border-t border-green-200 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Original Amount</span>
                <span className="font-medium text-green-800">
                  {formatPrice(appliedCoupon.pricing.originalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Discount</span>
                <span className="font-medium text-green-800">
                  -{formatPrice(appliedCoupon.pricing.discountAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-green-800">You Pay</span>
                <span className="text-green-900">
                  {formatPrice(appliedCoupon.pricing.finalAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
