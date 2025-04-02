import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { TaskFilters } from "@/components/task-filters";
import { TaskSearch } from "@/components/task-search";
import { TaskStats } from "@/components/task-stats";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Fetch tasks
  const { 
    data: tasks = [] as Task[], 
    isLoading 
  } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (text: string) => {
      await apiRequest('POST', '/api/tasks', { text, completed: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add task",
        description: "There was an error adding your task. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, text, completed }: { id: number, text: string, completed: boolean }) => {
      await apiRequest('PATCH', `/api/tasks/${id}`, { text, completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete task",
        description: "There was an error deleting your task. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Clear completed tasks mutation
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/tasks/completed/clear');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Completed tasks cleared",
        description: "All completed tasks have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to clear tasks",
        description: "There was an error clearing completed tasks. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task: Task) => 
        task.text.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (currentFilter === 'active') {
      filtered = filtered.filter((task: Task) => !task.completed);
    } else if (currentFilter === 'completed') {
      filtered = filtered.filter((task: Task) => task.completed);
    }
    
    // Sort tasks - newest first
    filtered.sort((a: Task, b: Task) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    return filtered;
  }, [tasks, searchQuery, currentFilter]);
  
  // Handler functions
  const handleAddTask = (text: string) => {
    createTaskMutation.mutate(text);
  };
  
  const handleToggleComplete = (task: Task) => {
    updateTaskMutation.mutate({ 
      id: task.id, 
      text: task.text, 
      completed: !task.completed 
    });
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleUpdateTask = (id: number, text: string, completed: boolean) => {
    updateTaskMutation.mutate({ id, text, completed });
  };
  
  const handleDeleteTask = (task: Task) => {
    deleteTaskMutation.mutate(task.id);
  };
  
  const handleClearCompleted = () => {
    clearCompletedMutation.mutate();
  };
  
  const focusNewTaskInput = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const inputEl = document.querySelector('input[placeholder="Add a new task..."]');
      if (inputEl) (inputEl as HTMLInputElement).focus();
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
            <CheckCircle className="mr-2" />
            TaskFlow
          </h1>
          <TaskStats tasks={tasks} />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6">
        {/* Task Controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TaskFilters 
            currentFilter={currentFilter} 
            onFilterChange={setCurrentFilter} 
          />
          
          <TaskSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>

        {/* New Task Form */}
        <TaskForm 
          onSubmit={handleAddTask} 
          isSubmitting={createTaskMutation.isPending} 
        />

        {/* Task List */}
        <TaskList 
          tasks={filteredTasks}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          filter={currentFilter}
          searchQuery={searchQuery}
        />

        {/* Clear Completed Button Section */}
        {tasks.some((task: Task) => task.completed) && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleClearCompleted}
              variant="ghost"
              className="text-sm text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
              disabled={clearCompletedMutation.isPending}
            >
              <span className="mr-1">🧹</span> Clear completed tasks
            </Button>
          </div>
        )}
      </main>

      {/* Edit Task Dialog */}
      <EditTaskDialog 
        task={editingTask}
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        isSubmitting={updateTaskMutation.isPending}
      />

      {/* Floating Add Button (Mobile) */}
      {isMobile && (
        <div className="fixed right-6 bottom-6 sm:hidden">
          <Button 
            onClick={focusNewTaskInput}
            className="bg-primary-600 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
          >
            <Plus className="text-lg" />
          </Button>
        </div>
      )}
    </div>
  );
}
