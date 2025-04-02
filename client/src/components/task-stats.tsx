import { Task } from "@shared/schema";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  
  return (
    <div className="text-sm">
      {totalTasks} tasks ({completedTasks} completed)
    </div>
  );
}
