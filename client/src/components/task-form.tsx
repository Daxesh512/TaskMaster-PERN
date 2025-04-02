import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const taskSchema = z.object({
  text: z.string().min(1, "Task cannot be empty").max(100, "Task is too long")
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
}

export function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      text: ""
    }
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values.text);
    form.reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.1)] mb-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Add a new task..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    disabled={isSubmitting}
                    maxLength={100}
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="bg-primary-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Add Task
          </Button>
        </form>
      </Form>
    </div>
  );
}
