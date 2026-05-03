'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import IconInput from '@/components/auth/IconInput';
import { EmailIcon } from '@/components/auth/AuthIcons';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await forgotPassword({ email });

    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 border border-gray-200 rounded-lg p-6 sm:p-8 bg-white shadow-lg">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Logo width={160} height={44} className="rounded-xl sm:w-[180px]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you an OTP to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <IconInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              icon={<EmailIcon />}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] hover:shadow-lg hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0099ff] disabled:opacity-50 transition-all shadow-md shadow-blue-500/30"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>

          <div className="text-center">
            <Link href="/login" className="font-medium text-[#0099ff] hover:text-[#003399] text-sm">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
