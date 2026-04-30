export default function AdminEnrollmentsLoadingState() {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#0099ff] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-[#0099ff] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-[#0099ff] rounded-full animate-bounce"></div>
          </div>
          <span className="text-gray-500 text-sm">Loading enrollments...</span>
        </div>
      </td>
    </tr>
  );
}
