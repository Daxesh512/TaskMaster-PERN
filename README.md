# Task Manager

A modern, responsive to-do list web application designed to enhance productivity through intuitive task management features.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (All, Active, Completed)
- Search tasks by text
- Clear all completed tasks
- Responsive design for mobile, tablet, and desktop
- Persistent storage with PostgreSQL database

## Tech Stack

- **Frontend**: React, TypeScript, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Tooling**: Vite, ESBuild

## Running Locally

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- PostgreSQL database (optional - falls back to in-memory storage)

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd task-manager
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up database (optional)

You have two options for the database:

**Option 1: Use a local PostgreSQL installation**
- Install PostgreSQL on your machine if you don't have it already
- Create a new database for the project
- Set the DATABASE_URL environment variable to your database connection string:
  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
  ```

**Option 2: Use a hosted PostgreSQL service**
- You can use a service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [ElephantSQL](https://www.elephantsql.com/) for a free PostgreSQL database
- Set the DATABASE_URL environment variable to the connection string they provide

**Create tables**
If using a database, run the migration to create your database tables:
```bash
npm run db:push
```

### Step 4: Start the application

```bash
npm run dev
```

The application should now be running at `http://localhost:5000`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (optional)

## Application Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/lib/`: Utility functions and API client
  - `src/pages/`: Application pages
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage interface and implementations
  - `db.ts`: Database connection
- `shared/`: Shared types and schemas
  - `schema.ts`: Database schema and TypeScript types

## API Endpoints

- `GET /api/tasks`: Get all tasks
- `GET /api/tasks/:id`: Get a specific task
- `POST /api/tasks`: Create a new task
- `PATCH /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task
- `DELETE /api/tasks/completed/clear`: Delete all completed tasks

## License

[MIT](LICENSE)