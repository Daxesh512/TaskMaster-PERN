import { Task } from "@shared/schema";
import { TaskItem } from "./task-item";
import { EmptyState } from "./ui/empty-state";
import { ClipboardList } from "lucide-react";
import { useCallback } from "react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  filter: string;
  searchQuery: string;
}

export function TaskList({ 
  tasks, 
  isLoading, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  filter,
  searchQuery
}: TaskListProps) {
  
  const getEmptyStateMessage = useCallback(() => {
    if (tasks.length === 0 && !isLoading && !searchQuery && filter === 'all') {
      return "You don't have any tasks yet. Add your first task to get started!";
    }
    
    if (searchQuery) {
      return `No tasks match your search "${searchQuery}"`;
    }
    
    if (filter === 'active') {
      return "No active tasks. Great job!";
    }
    
    if (filter === 'completed') {
      return "No completed tasks yet. Time to be productive!";
    }
    
    return "No tasks found";
  }, [tasks.length, isLoading, filter, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.1)] p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState 
        icon={<ClipboardList />} 
        title="No tasks found" 
        message={getEmptyStateMessage()} 
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
