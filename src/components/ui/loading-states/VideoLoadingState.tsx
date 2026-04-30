export default function VideoLoadingState() {
  return (
    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin border-[#0099ff]"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Loading video player...</p>
      </div>
    </div>
  );
}
