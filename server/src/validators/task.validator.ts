import { z } from 'zod';

const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);
const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Task title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 string' })
    .optional()
    .or(z.date().optional()),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Provide at least one field to update' }
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;