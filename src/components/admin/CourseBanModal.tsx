'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/lib/api/adminService';

interface CourseBanModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  onSuccess: () => void;
}

const FALLBACK_REASONS = [
  'Violation of terms of service',
  'Inappropriate behavior',
  'Cheating or academic dishonesty',
  'Payment fraud',
  'Sharing course content illegally',
  'Harassment of other students or instructors',
  'Spam or abusive activity',
  'Multiple account abuse',
  'Other',
];

export default function CourseBanModal({
  isOpen, onClose, studentId, studentName, courseId, courseTitle, onSuccess
}: CourseBanModalProps) {
  const [banReason, setBanReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [isPermanent, setIsPermanent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reasons, setReasons] = useState<string[]>(FALLBACK_REASONS);

  useEffect(() => {
    if (!isOpen) return;
    adminService.getBanReasons()
      .then((res) => { if (res.success) setReasons(res.data.reasons); })
      .catch(() => {});
  }, [isOpen]);

  const effectiveReason = banReason === 'Other' ? customReason.trim() : banReason;

  const handleClose = () => {
    setBanReason('');
    setCustomReason('');
    setDurationHours('');
    setIsPermanent(true);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveReason) {
      setError('Please select or provide a reason');
      return;
    }
    if (!isPermanent && (!durationHours || durationHours < 1)) {
      setError('Please enter a valid duration');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await adminService.banStudentFromCourse(studentId, courseId, {
        banReason: effectiveReason,
        durationHours: isPermanent ? undefined : (durationHours as number),
      });
      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError((response as any).message || 'Failed to ban student from course');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban student from course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-orange-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ban from Course</h3>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{studentName}</span> · {courseTitle}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <select
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
              required
            >
              <option value="">Select a reason...</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {banReason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specify reason *</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the reason..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] resize-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ban type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPermanent(true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  isPermanent
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Permanent
              </button>
              <button
                type="button"
                onClick={() => setIsPermanent(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  !isPermanent
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Temporary
              </button>
            </div>
          </div>

          {!isPermanent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours) *</label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value ? parseInt(e.target.value) : '')}
                min={1}
                max={8760}
                placeholder="e.g. 24 = 1 day, 168 = 1 week"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
                required={!isPermanent}
              />
              <p className="text-xs text-gray-400 mt-1">Max 8760 hours (1 year)</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Banning...' : 'Ban from Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
