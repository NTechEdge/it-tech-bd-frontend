export default function AdminMobileListLoadingState() {
  return (
    <div className="px-4 py-8 flex items-center justify-center gap-3">
      <div className="relative w-5 h-5">
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin border-[#0099ff]"></div>
      </div>
      <span className="text-gray-500 text-sm">Loading...</span>
    </div>
  );
}
