import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  clearCompletedTasks(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private taskStore: Map<number, Task>;
  currentId: number;
  currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.taskStore = new Map();
    this.currentId = 1;
    this.currentTaskId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.taskStore.values());
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.taskStore.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const now = new Date();
    
    const newTask: Task = {
      id,
      text: task.text,
      completed: task.completed || false,
      createdAt: now
    };
    
    this.taskStore.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, update: UpdateTask): Promise<Task | undefined> {
    const task = this.taskStore.get(id);
    
    if (!task) {
      return undefined;
    }
    
    const updatedTask: Task = {
      ...task,
      text: update.text !== undefined ? update.text : task.text,
      completed: update.completed !== undefined ? update.completed : task.completed
    };
    
    this.taskStore.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.taskStore.delete(id);
  }

  async clearCompletedTasks(): Promise<boolean> {
    let deleted = false;
    
    for (const [id, task] of this.taskStore.entries()) {
      if (task.completed) {
        this.taskStore.delete(id);
        deleted = true;
      }
    }
    
    return deleted;
  }
}

export const storage = new MemStorage();
