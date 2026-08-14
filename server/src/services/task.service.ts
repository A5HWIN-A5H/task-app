import { Task, ITask } from '../models/Task';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';
import { ApiError } from '../utils/ApiError';

interface GetTasksParams {
  userId: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export class TaskService {
  static async createTask(input: CreateTaskInput, userId: string): Promise<ITask> {
    const task = await Task.create({
      ...input,
      owner: userId,
    });
    return task;
  }

  static async getTasks(params: GetTasksParams) {
    const {
      userId,
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = params;

    
    const query: any = { owner: userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' }; 
    }

    const skip = (page - 1) * limit;
    const sortDirection = order === 'desc' ? -1 : 1;
    const sortObject = { [sortBy]: sortDirection };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortObject as any).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    return {
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await Task.findById(taskId);
    
    if (!task) throw ApiError.notFound('Task not found');
    if (task.owner.toString() !== userId) throw ApiError.forbidden('You do not have permission to access this task');
    
    return task;
  }

  static async updateTask(taskId: string, userId: string, input: UpdateTaskInput): Promise<ITask> {
    const task = await this.getTaskById(taskId, userId); 

    Object.assign(task, input);
    await task.save();

    return task;
  }

  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId, userId); 
    await task.deleteOne();
  }
}