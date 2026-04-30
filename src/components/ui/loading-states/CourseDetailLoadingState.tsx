export default function CourseDetailLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin border-[#0099ff]"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#0099ff] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading course details...</p>
        <p className="text-gray-400 text-sm mt-2">Preparing your learning experience</p>
      </div>
    </div>
  );
}
