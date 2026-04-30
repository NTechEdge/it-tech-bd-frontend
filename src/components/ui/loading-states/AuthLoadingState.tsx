export default function AuthLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#0099ff] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-700 font-medium">Verifying your credentials...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we secure your session</p>
        </div>
      </div>
    </div>
  );
}
