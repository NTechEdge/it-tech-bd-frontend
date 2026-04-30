interface DashboardCardLoadingStateProps {
  message?: string;
}

export default function DashboardCardLoadingState({ message = "Loading..." }: DashboardCardLoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0099ff] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-500 text-sm">{message}</span>
      </div>
    </div>
  );
}
