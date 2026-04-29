'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const PREDEFINED_TOPICS = [
  'Web Development',
  'Digital Marketing',
  'Graphic Design',
  'UI/UX Design',
  'Mobile App Development',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Blockchain',
  'Game Development',
  'SEO',
  'Content Writing',
  'Video Editing',
  'Photography',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
];

export default function InterestsPage() {
  const { user, updateInterests } = useAuth();
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Skip if user already has interests
  useEffect(() => {
    if (user?.interestedTopics && user.interestedTopics.length > 0) {
      router.push('/');
    }
  }, [user, router]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleContinue = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateInterests(selectedTopics);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message || 'Failed to save interests');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">IT-TECH-BD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Choose Your Interests
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select topics you're interested in. We'll personalize your learning experience based on your choices.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Topics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Interests</h2>
          <div className="flex flex-wrap gap-3">
            {PREDEFINED_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTopics.includes(topic)
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        {selectedTopics.length > 0 && (
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 mb-6">
            <p className="text-sm font-medium text-orange-900">
              {selectedTopics.length} interest{selectedTopics.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={loading}
            className="flex-1 px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading || selectedTopics.length === 0}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          You can always update your interests later in your profile settings
        </p>
      </div>
    </div>
  );
}
