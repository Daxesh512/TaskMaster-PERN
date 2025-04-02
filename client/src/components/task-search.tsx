import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TaskSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TaskSearch({ searchQuery, onSearchChange }: TaskSearchProps) {
  return (
    <div className="relative flex-grow sm:max-w-xs">
      <Input 
        type="text" 
        placeholder="Search tasks..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-gray-400 h-4 w-4" />
      </div>
    </div>
  );
}
