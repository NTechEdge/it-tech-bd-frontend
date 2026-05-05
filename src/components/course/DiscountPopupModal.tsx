"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { couponService, CouponValidationResult } from "@/lib/api/couponService";

interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  category?: string;
}

interface Props {
  course: Course;
  onClose: () => void;
}

interface ActiveCoupon {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  finalPrice: number;
}

export default function DiscountPopupModal({ course, onClose }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeCoupon, setActiveCoupon] = useState<ActiveCoupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveCoupons();
  }, [course._id]);

  const checkActiveCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons({
        status: "active",
        limit: 100,
      });

      if (response.success && response.data.coupons.length > 0) {
        const applicableCoupon = response.data.coupons.find((coupon) => {
          if (coupon.status !== "active") return false;

          const now = new Date();
          const validFrom = new Date(coupon.validFrom);
          const validUntil = new Date(coupon.validUntil);

          if (now < validFrom || now > validUntil) return false;

          if (coupon.scope === "all") return true;
          if (coupon.scope === "specific" && coupon.applicableCourses) {
            return coupon.applicableCourses.some((c) => c._id === course._id);
          }
          if (coupon.scope === "category" && coupon.applicableCategories) {
            return coupon.applicableCategories.includes(course.category || "");
          }

          return false;
        });

        if (applicableCoupon) {
          const validationResult = await couponService.validateCoupon(
            applicableCoupon.code,
            course._id,
            course.price
          );

          if (validationResult.success && validationResult.data.isValid && validationResult.data.coupon) {
            const { coupon, pricing } = validationResult.data;
            setActiveCoupon({
              code: coupon.code,
              discount: coupon.discountValue,
              discountType: coupon.discountType,
              finalPrice: pricing?.finalAmount ?? course.price,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking active coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    onClose();

    if (isAuthenticated) {
      router.push(`/checkout/${course._id}?coupon=${activeCoupon?.code}`);
    } else {
      const checkoutUrl = `/checkout/${course._id}?coupon=${activeCoupon?.code}`;
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}&redirectAfterLogin=true`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#0099ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!activeCoupon) {
    onClose();
    return null;
  }

  const discountPercentage = activeCoupon.discountType === "percentage"
    ? activeCoupon.discount
    : Math.round((activeCoupon.discount / course.price) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Special Discount Available!</h2>
          <p className="text-blue-100">Limited time offer on this course</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Course info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-16 h-16 object-cover rounded-lg" />
            ) : (
              <div className="w-16 h-16 bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-gray-900">Tk {activeCoupon.finalPrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 line-through">Tk {course.price.toLocaleString()}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {discountPercentage}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Coupon badge */}
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700 font-medium mb-1">Auto-applied coupon</p>
                <p className="text-lg font-bold text-yellow-800">{activeCoupon.code}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-700">You save</p>
                <p className="text-lg font-bold text-green-600">
                  Tk {(course.price - activeCoupon.finalPrice).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timer/urgency */}
          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg p-3 mb-6">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="font-medium">Limited time offer — Don't miss out!</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handlePurchase}
              className="flex-1 py-3 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              {isAuthenticated ? "Purchase Now" : "Login & Purchase"}
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-center text-gray-500 mt-3">
              You'll be redirected to login first, then back to checkout with your discount
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
