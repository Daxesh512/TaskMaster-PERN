import { Task } from "@shared/schema";
import { PencilIcon, Trash2Icon, CheckIcon } from "lucide-react";
import { formatRelative } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const formattedDate = formatRelative(new Date(task.createdAt), new Date());
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.1)] p-4 flex items-start gap-3 group relative ${task.completed ? 'border-l-4 border-l-emerald-500' : ''}`}>
      
      {/* Checkbox */}
      <div>
        <button 
          onClick={() => onToggleComplete(task)}
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500 focus:ring-emerald-500' 
              : 'border-gray-400 focus:ring-primary-500'
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <CheckIcon className="text-white text-xs" />}
        </button>
      </div>
      
      {/* Task Content */}
      <div className="flex-grow">
        <p 
          className={`text-gray-800 break-words mb-1 pr-8 ${task.completed ? 'line-through text-gray-500' : ''}`}
        >
          {task.text}
        </p>
        <p className="text-xs text-gray-500">Added {formattedDate}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute right-4 top-4 flex items-center">
        <button 
          onClick={() => onEdit(task)}
          className="text-gray-500 hover:text-primary-600 p-1 transition-colors"
          aria-label="Edit task"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(task)}
          className="text-gray-500 hover:text-red-600 p-1 transition-colors"
          aria-label="Delete task"
        >
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
