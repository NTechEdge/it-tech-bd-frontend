interface AdminActionLoadingStateProps {
  action: string;
}

export default function AdminActionLoadingState({ action }: AdminActionLoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <span className="text-green-600 text-sm font-medium">{action}...</span>
      </div>
    </div>
  );
}
