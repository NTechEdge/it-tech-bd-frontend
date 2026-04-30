export default function EnrollmentLoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 border-3 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-t-transparent rounded-full animate-spin border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Processing enrollment...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait</p>
      </div>
    </div>
  );
}
