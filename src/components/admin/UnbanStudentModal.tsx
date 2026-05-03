'use client';

import { useState } from 'react';
import { adminService } from '@/lib/api/adminService';

interface UnbanStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSuccess: () => void;
}

export default function UnbanStudentModal({ isOpen, onClose, studentId, studentName, onSuccess }: UnbanStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnban = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await adminService.unbanStudent(studentId);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to unban student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unban student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Unban Student</h3>
            <p className="text-sm text-gray-600">Restore access for {studentName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          This student will be able to enroll in courses and access the platform again. Are you sure you want to proceed?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUnban}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Unbanning...' : 'Unban Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
