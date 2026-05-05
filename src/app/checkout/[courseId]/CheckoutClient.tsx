"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
import { studentService } from "@/lib/api/studentService";
import { couponService, CouponValidationResult } from "@/lib/api/couponService";
import { Course } from "@/lib/api/server";

interface CheckoutClientProps {
  course: Course;
  courseId: string;
}

export default function CheckoutClient({ course, courseId }: CheckoutClientProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [trxId, setTrxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [availableCoupon, setAvailableCoupon] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const finalPrice = appliedCoupon?.pricing?.finalAmount ?? course?.price ?? 0;
  const discountAmount = appliedCoupon?.pricing?.discountAmount ?? 0;

  // Check for available coupon when course is loaded
  const checkForAvailableCoupon = useCallback(async () => {
    setCheckingCoupon(true);
    try {
      console.log('Checking for applicable coupons for courseId:', courseId);
      // Use the new public API endpoint for applicable coupons
      const response = await couponService.getApplicableCoupons(courseId);
      console.log('Applicable coupons response:', response);

      if (response.success && response.data.coupons.length > 0) {
        // Get the first available coupon
        console.log('Found applicable coupon:', response.data.coupons[0].code);
        setAvailableCoupon(response.data.coupons[0].code);
      } else {
        console.log('No applicable coupons found');
        setAvailableCoupon(null);
      }
    } catch (error) {
      console.error('Error fetching applicable coupons:', error);
      setAvailableCoupon(null);
    } finally {
      setCheckingCoupon(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (course && isAuthenticated && !appliedCoupon && courseId) {
      checkForAvailableCoupon();
    }
  }, [course, isAuthenticated, appliedCoupon, courseId, checkForAvailableCoupon]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/checkout/${courseId}`)}&redirectAfterLogin=true`);
    }
  }, [isAuthenticated, courseId, router]);

  const validateAndApplyCoupon = async (code: string) => {
    try {
      setValidatingCoupon(true);
      setCouponMessage("");
      setFormError("");

      const response = await couponService.validateCoupon(code, courseId, course?.price ?? 0);

      if (response.success && response.data.isValid) {
        setAppliedCoupon(response.data);
        setCouponMessage("");
      } else {
        setCouponMessage(response.data.reason || response.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to validate coupon";
      setCouponMessage(errorMessage);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }
    await validateAndApplyCoupon(couponInput.trim());
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");
  };

  const handleHaveCouponClick = () => {
    if (availableCoupon) {
      setCouponInput(availableCoupon);
      setCouponMessage("");
    } else {
      setCouponMessage("No coupon available for this course.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setFormError("Please enter your bKash Transaction ID");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const response = await studentService.enrollCourse({
        courseId,
        amount: finalPrice,
        trxId: trxId.trim(),
        couponCode: appliedCoupon?.coupon?.code,
      });

      if (response.success) {
        router.push(`/student/dashboard/my-courses/${courseId}?enrollment=pending`);
      } else {
        setFormError(response.message || "Enrollment failed");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600 mb-8">Complete your enrollment for <span className="font-semibold text-gray-900">{course.title}</span></p>

                {/* Course Summary */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-8">
                  {course.thumbnailUrl ? (
                    <div className="relative w-24 h-24 shrink-0">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-lg flex items-center justify-center">
                      <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.category}</p>
                    <p className="text-sm text-gray-500 mt-1">{course.level}</p>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      disabled={validatingCoupon}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponInput.trim()}
                      className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validatingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {couponMessage && (
                    <div className={`mb-2 text-sm ${couponMessage.includes("Invalid") || couponMessage.includes("Please") ? "text-red-600" : "text-green-600"}`}>
                      {couponMessage}
                    </div>
                  )}

                  {!appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleHaveCouponClick}
                      disabled={checkingCoupon}
                      className="text-sm text-[#0099ff] hover:text-[#003399] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v10.54a2 2 0 01-2 2V8a2 2 0 012-2h2.54a2 2 0 011.72-1h.05a2 2 0 011.72 1V12a2 2 0 002 2v7.72a2 2 0 01-.6 1.4 2 2 0 01-.6.6l.06.06a2 2 0 01.06.06 2.01V23a2 2 0 01-2 2h-2.06a2 2 0 01-2-2V8.27a2 2 0 011-1.72-1H4a2 2 0 01-1.72 1v1.72a2 2 0 01.06.06 2.01V4zm-1 8a1 1 0 100 2 1 1 0 000-2z" />
                      </svg>
                      Have a coupon?
                    </button>
                  )}

                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-.45 1-1 1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1 .45-1 1-1 .45-1 1 1 .45 1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-green-900">Coupon Applied!</p>
                            <p className="text-sm text-green-700">
                              {appliedCoupon.coupon?.code} — {
                                appliedCoupon.coupon?.discountType === "percentage"
                                  ? `${appliedCoupon.coupon?.discountValue}% off`
                                  : `Tk ${appliedCoupon.coupon?.discountValue} off`
                              }
                            </p>
                            <p className="text-sm font-medium text-green-800 mt-1">
                              You save: Tk {discountAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-600 hover:text-red-700 font-medium underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      bKash Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 8N7A6B5C4D"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Payment Instructions</h4>
                    <ol className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">1.</span>
                        <div className="flex-1">
                          Send <strong>Tk {finalPrice.toLocaleString()}</strong> to our bKash number
                          {discountAmount > 0 && (
                            <span className="ml-2 text-green-700">
                              (Original: Tk {course.price.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </li>
                      <li className="font-mono font-bold text-blue-900 text-center py-2 bg-white rounded-lg">01XXXXXXXXXX</li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">2.</span>
                        <span>Copy the Transaction ID (TrxID) from your bKash app</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">3.</span>
                        <span>Paste it above and submit</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                    Your enrollment will be reviewed and approved by an admin within 24 hours. You'll get access to the course once approved.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : `Complete Enrollment - Tk ${finalPrice.toLocaleString()}`}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Course Price</span>
                    <span className="text-gray-900">Tk {course.price.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600 font-medium">-Tk {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total to Pay</span>
                      <span className="text-xl font-bold text-gray-900">Tk {finalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {appliedCoupon && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span className="font-medium">Coupon Applied</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        {appliedCoupon.coupon?.code} — {
                          appliedCoupon.coupon?.discountType === "percentage"
                            ? `${appliedCoupon.coupon?.discountValue}% off`
                            : `Tk ${appliedCoupon.coupon?.discountValue} off`
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <span>24/7 support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
