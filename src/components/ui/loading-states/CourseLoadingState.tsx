export default function CourseLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-transparent border-r-transparent rounded-full animate-spin border-b-[#0099ff] border-l-[#003399]"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#0099ff]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Loading courses...</p>
        <p className="text-gray-400 text-sm mt-1">Finding the best courses for you</p>
      </div>
    </div>
  );
}
