'use client';

import { useState } from 'react';
import { adminService } from '@/lib/api/adminService';

interface BanStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSuccess: () => void;
}

export default function BanStudentModal({ isOpen, onClose, studentId, studentName, onSuccess }: BanStudentModalProps) {
  const [banReason, setBanReason] = useState('');
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [isPermanent, setIsPermanent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banReason.trim()) {
      setError('Please provide a reason for banning this student');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await adminService.banStudent(studentId, {
        banReason: banReason.trim(),
        durationHours: isPermanent ? undefined : (durationHours as number),
      });

      if (response.success) {
        onSuccess();
        onClose();
        setBanReason('');
        setDurationHours('');
        setIsPermanent(true);
      } else {
        setError(response.message || 'Failed to ban student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ban Student</h3>
        <p className="text-sm text-gray-600 mb-4">
          You are about to ban <span className="font-semibold text-gray-900">{studentName}</span>
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for ban *</label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g., Violating community guidelines, spamming, etc."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ban Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isPermanent}
                  onChange={() => setIsPermanent(true)}
                  className="w-4 h-4 text-[#0099ff] focus:ring-[#0099ff]"
                />
                <span className="text-sm text-gray-700">Permanent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isPermanent}
                  onChange={() => setIsPermanent(false)}
                  className="w-4 h-4 text-[#0099ff] focus:ring-[#0099ff]"
                />
                <span className="text-sm text-gray-700">Temporary</span>
              </label>
            </div>
          </div>

          {!isPermanent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value ? parseInt(e.target.value) : '')}
                min={1}
                max={8760}
                placeholder="e.g., 24 for 1 day, 168 for 1 week"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent"
                required={!isPermanent}
              />
              <p className="text-xs text-gray-500 mt-1">Max 8760 hours (1 year)</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Banning...' : 'Ban Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
