"use client";

import { useState } from "react";
import { Enrollment, studentService } from "@/lib/api/studentService";

interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
}

interface Props {
  course: Course;
  onClose: () => void;
  onSuccess: (enrollment: Enrollment) => void;
}

export default function EnrollmentModal({ course, onClose, onSuccess }: Props) {
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setError("Please enter your bKash Transaction ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await studentService.enrollCourse({
        courseId: course._id,
        amount: course.price,
        trxId: trxId.trim(),
      });

      if (response.success) {
        onSuccess(response.data);
      } else {
        setError(response.message || "Enrollment failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Enroll in Course</h2>
        <p className="text-sm text-gray-500 mb-6">{course.title}</p>

        {/* Payment Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Course Fee</span>
            <span className="text-lg font-bold text-gray-900">৳{course.price.toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-orange-700">Payment Instructions:</p>
            <p>1. Send ৳{course.price.toLocaleString()} to our bKash number</p>
            <p className="font-mono font-bold text-gray-900">01XXXXXXXXXX</p>
            <p>2. Copy the Transaction ID (TrxID)</p>
            <p>3. Paste it below and submit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              bKash Transaction ID (TrxID)
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. 8N7A6B5C4D"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
            Your enrollment will be reviewed and approved by an admin within 24 hours. You&apos;ll get access to the course once approved.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Enrollment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
