interface AdminTableLoadingStateProps {
  colSpan?: number;
  message?: string;
}

export default function AdminTableLoadingState({ colSpan = 7, message = "Loading..." }: AdminTableLoadingStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin border-[#0099ff]"></div>
          </div>
          <span className="text-gray-500 text-sm">{message}</span>
        </div>
      </td>
    </tr>
  );
}
