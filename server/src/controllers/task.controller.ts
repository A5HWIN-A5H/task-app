import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const task = await TaskService.createTask(req.body, req.user!._id.toString());
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

export const getTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const params = {
    userId: req.user!._id.toString(),
    page: req.query.page ? parseInt(req.query.page.toString(), 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit.toString(), 10) : undefined,
    status: req.query.status?.toString(),
    priority: req.query.priority?.toString(),
    search: req.query.search?.toString(),
    sortBy: req.query.sortBy?.toString(),
    order: req.query.order as 'asc' | 'desc' | undefined,
  };

  const result = await TaskService.getTasks(params);
  
  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

export const getTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const task = await TaskService.getTaskById(req.params.id as string, req.user!._id.toString());
  res.status(200).json({
    success: true,
    message: 'Task retrieved successfully',
    data: { task },
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const task = await TaskService.updateTask(req.params.id as string, req.user!._id.toString(), req.body);
  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await TaskService.deleteTask(req.params.id as string, req.user!._id.toString());
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});