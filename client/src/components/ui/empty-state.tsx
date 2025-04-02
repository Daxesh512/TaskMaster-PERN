import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.1)] p-8 text-center">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-6xl text-gray-300 mb-4">{icon}</div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}
