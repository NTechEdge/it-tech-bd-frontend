'use client';

import { useEffect, useState } from 'react';
import { adminService, PlatformSettings } from '@/lib/api/adminService';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();
      if (response.success) {
        setSettings(response.data);
      } else {
        setError('Failed to load settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');

      await adminService.updateSettings(settings);
      setMessage('Settings updated successfully!');

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (updates: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev!, ...updates }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-gray-600">No settings available</div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <p className="text-sm text-gray-600">Manage your platform configuration</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              value={settings.siteName}
              onChange={(e) => updateSettings({ siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSettings({ siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
              <p className="text-xs text-gray-500">
                Disable the platform for maintenance
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={settings.contactEmail}
              onChange={(e) => updateSettings({ contactEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              id="contactPhone"
              value={settings.contactPhone}
              onChange={(e) => updateSettings({ contactPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Feature Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Registration
              </label>
              <p className="text-xs text-gray-500">
                Allow new users to register
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  features: { ...settings.features, enableRegistration: !settings.features?.enableRegistration },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.features?.enableRegistration ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.features?.enableRegistration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Course Review
              </label>
              <p className="text-xs text-gray-500">
                Allow students to review courses
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  features: { ...settings.features, enableCourseReview: !settings.features?.enableCourseReview },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.features?.enableCourseReview ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.features?.enableCourseReview ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Certificates
              </label>
              <p className="text-xs text-gray-500">
                Issue certificates on course completion
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  features: { ...settings.features, enableCertificates: !settings.features?.enableCertificates },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.features?.enableCertificates ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.features?.enableCertificates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) =>
                updateSettings({ socialLinks: { ...settings.socialLinks, facebook: e.target.value } })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              value={settings.socialLinks?.twitter || ''}
              onChange={(e) =>
                updateSettings({ socialLinks: { ...settings.socialLinks, twitter: e.target.value } })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>

          <div>
            <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube
            </label>
            <input
              type="text"
              id="youtube"
              value={settings.socialLinks?.youtube || ''}
              onChange={(e) =>
                updateSettings({ socialLinks: { ...settings.socialLinks, youtube: e.target.value } })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
