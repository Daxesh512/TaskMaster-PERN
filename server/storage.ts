import { tasks, users, type Task, type InsertTask, type UpdateTask, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { log } from "./vite";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  clearCompletedTasks(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private taskStore: Map<number, Task>;
  currentId: number;
  currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.taskStore = new Map();
    this.currentId = 1;
    this.currentTaskId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
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
    
    // Convert to array first to avoid iterator issues
    const entries = Array.from(this.taskStore.entries());
    for (const [id, task] of entries) {
      if (task.completed) {
        this.taskStore.delete(id);
        deleted = true;
      }
    }
    
    return deleted;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      if (!db) return undefined;
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting user by id: ${error}`, 'storage');
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (!db) return undefined;
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting user by username: ${error}`, 'storage');
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      if (!db) throw new Error('Database not available');
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      log(`Error creating user: ${error}`, 'storage');
      throw error;
    }
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    try {
      if (!db) return [];
      return await db.select().from(tasks).orderBy(tasks.createdAt);
    } catch (error) {
      log(`Error getting all tasks: ${error}`, 'storage');
      return [];
    }
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    try {
      if (!db) return undefined;
      const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting task by id: ${error}`, 'storage');
      return undefined;
    }
  }

  async createTask(task: InsertTask): Promise<Task> {
    try {
      if (!db) throw new Error('Database not available');
      const result = await db.insert(tasks).values(task).returning();
      return result[0];
    } catch (error) {
      log(`Error creating task: ${error}`, 'storage');
      throw error;
    }
  }

  async updateTask(id: number, update: UpdateTask): Promise<Task | undefined> {
    try {
      if (!db) return undefined;
      const result = await db
        .update(tasks)
        .set(update)
        .where(eq(tasks.id, id))
        .returning();
      return result[0];
    } catch (error) {
      log(`Error updating task: ${error}`, 'storage');
      return undefined;
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      if (!db) return false;
      const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      log(`Error deleting task: ${error}`, 'storage');
      return false;
    }
  }

  async clearCompletedTasks(): Promise<boolean> {
    try {
      if (!db) return false;
      const result = await db
        .delete(tasks)
        .where(eq(tasks.completed, true))
        .returning();
      return result.length > 0;
    } catch (error) {
      log(`Error clearing completed tasks: ${error}`, 'storage');
      return false;
    }
  }
}

// Choose the appropriate storage implementation based on database availability
export const storage = db ? new DatabaseStorage() : new MemStorage();
