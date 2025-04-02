import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Task } from "@shared/schema";

const editTaskSchema = z.object({
  text: z.string().min(1, "Task cannot be empty").max(100, "Task is too long"),
  completed: z.boolean()
});

type EditTaskValues = z.infer<typeof editTaskSchema>;

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number, text: string, completed: boolean) => void;
  isSubmitting: boolean;
}

export function EditTaskDialog({ 
  task, 
  open, 
  onClose, 
  onSubmit,
  isSubmitting 
}: EditTaskDialogProps) {
  const form = useForm<EditTaskValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      text: task?.text || "",
      completed: task?.completed || false
    },
    values: {
      text: task?.text || "",
      completed: task?.completed || false
    }
  });

  const handleSubmit = (values: EditTaskValues) => {
    if (task) {
      onSubmit(task.id, values.text, values.completed);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Edit Task</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="p-1">
              <Label htmlFor="editTaskInput" className="block text-sm font-medium text-gray-700 mb-2">
                Task description
              </Label>
              
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="editTaskInput"
                        placeholder="Task description"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex items-center mt-4">
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          id="editTaskCompleted" 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </FormControl>
                      <Label htmlFor="editTaskCompleted" className="text-sm text-gray-700">
                        Mark as completed
                      </Label>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
