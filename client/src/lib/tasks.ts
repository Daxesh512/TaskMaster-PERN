import { Task } from "@shared/schema";

// Helper function to format dates
export function formatDate(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'yesterday';
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Filter functions
export function filterTasks(tasks: Task[], filter: string, searchQuery: string): Task[] {
  let filtered = [...tasks];
  
  // Apply search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(task => 
      task.text.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filter === 'active') {
    filtered = filtered.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filtered = filtered.filter(task => task.completed);
  }
  
  // Sort tasks - newest first
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  
  return filtered;
}

// Stats calculation
export function getTaskStats(tasks: Task[]): { total: number; completed: number } {
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length
  };
}
