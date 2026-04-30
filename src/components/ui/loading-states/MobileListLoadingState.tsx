export default function MobileListLoadingState() {
  return (
    <div className="px-4 py-6 flex items-center justify-center gap-3">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0099ff] rounded-full animate-spin"></div>
      <span className="text-gray-500 text-sm">Loading...</span>
    </div>
  );
}
