"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/api/authService";

export default function TestCouponsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token and user from localStorage
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();

    setToken(storedToken);
    setUser(storedUser);

    console.log('Test Page - Token:', storedToken ? 'exists' : 'missing');
    console.log('Test Page - User:', storedUser);

    // Test API call
    testApiCall(storedToken);
  }, []);

  const testApiCall = async (authToken: string | null) => {
    try {
      console.log('Testing API call to /api/coupons/stats');

      const response = await fetch('http://localhost:5000/api/coupons/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      setApiResponse({
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        setError(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to connect to API');
    }
  };

  const retryCall = () => {
    setError(null);
    setApiResponse(null);
    testApiCall(token);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Coupons API Test Page</h1>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
            {token && (
              <p className="text-sm text-gray-600 break-all">
                <strong>Token Value:</strong> {token.substring(0, 50)}...
              </p>
            )}
            <p><strong>User:</strong> {user ? `✅ ${user.name} (${user.role})` : '❌ Not logged in'}</p>
          </div>
        </div>

        {/* API Response */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">API Response</h2>
            <button
              onClick={retryCall}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-4">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {apiResponse ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Status:</p>
                <p className={apiResponse.ok ? 'text-green-600' : 'text-red-600'}>
                  {apiResponse.ok ? '✅ Success' : '❌ Failed'} ({apiResponse.status})
                </p>
              </div>
              <div>
                <p className="font-medium">Response Data:</p>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> http://localhost:5000/api</p>
            <p><strong>Endpoint:</strong> /api/coupons/stats</p>
            <p><strong>Required Role:</strong> admin</p>
            <p><strong>Authentication:</strong> Bearer token required</p>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium text-yellow-800">Troubleshooting:</p>
            <ul className="list-disc list-inside text-yellow-700 mt-2 space-y-1">
              <li>Make sure you're logged in as an admin</li>
              <li>Check that the backend is running on port 5000</li>
              <li>Verify CORS is configured correctly</li>
              <li>Check browser console for additional errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
