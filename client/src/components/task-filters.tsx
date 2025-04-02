import { Button } from "@/components/ui/button";

interface TaskFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
      <Button 
        onClick={() => onFilterChange('all')} 
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm ${
          currentFilter === 'all' 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        All
      </Button>
      <Button 
        onClick={() => onFilterChange('active')} 
        variant={currentFilter === 'active' ? 'default' : 'outline'}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm ${
          currentFilter === 'active' 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Active
      </Button>
      <Button 
        onClick={() => onFilterChange('completed')} 
        variant={currentFilter === 'completed' ? 'default' : 'outline'}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm ${
          currentFilter === 'completed' 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Completed
      </Button>
    </div>
  );
}
