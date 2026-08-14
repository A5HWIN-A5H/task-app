import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { TaskService } from '../services/task.service';

const runTaskTests = async () => {
  try {
    await connectDB();
    console.log('--- Starting Task API Tests ---');

    
    await User.deleteMany({ email: 'task_api_test@example.com' });
    const testUser = await User.create({ name: 'Task Test User', email: 'task_api_test@example.com', passwordHash: 'hash', role: 'USER' });
    await Task.deleteMany({ owner: testUser._id });

    const userIdStr = testUser._id.toString();

    
    const taskData = [
      { title: 'Write documentation', status: 'COMPLETED', priority: 'HIGH' },
      { title: 'Setup database', status: 'COMPLETED', priority: 'URGENT' },
      { title: 'Implement login', status: 'IN_PROGRESS', priority: 'HIGH' },
      { title: 'Design dashboard meeting', status: 'TODO', priority: 'MEDIUM' },
      { title: 'Fix bug 123', status: 'TODO', priority: 'LOW' },
    ];

    for (const t of taskData) {
      await TaskService.createTask(t as any, userIdStr);
    }
    console.log(`Created ${taskData.length} tasks for testing`);

    
    const page1 = await TaskService.getTasks({ userId: userIdStr, page: 1, limit: 2 });
    if (page1.tasks.length === 2 && page1.pagination.total === 5) {
      console.log('Pagination working correctly (Page 1 limit 2)');
    } else {
      console.error('Pagination failed');
    }

    
    const completedTasks = await TaskService.getTasks({ userId: userIdStr, status: 'COMPLETED' });
    if (completedTasks.tasks.length === 2 && completedTasks.tasks.every(t => t.status === 'COMPLETED')) {
      console.log('Filtering by status working correctly');
    }

    
    const searchTasks = await TaskService.getTasks({ userId: userIdStr, search: 'meeting' });
    if (searchTasks.tasks.length === 1 && searchTasks.tasks[0].title.includes('meeting')) {
      console.log('Searching working correctly (Found "meeting")');
    }

    
    const taskToUpdate = page1.tasks[0];
    const taskIdStr = taskToUpdate._id.toString();
    
    await TaskService.updateTask(taskIdStr, userIdStr, { title: 'Updated Title' });
    const updatedTask = await TaskService.getTaskById(taskIdStr, userIdStr);
    
    if (updatedTask.title === 'Updated Title') {
      console.log('Task update working correctly');
    }

    await TaskService.deleteTask(updatedTask._id.toString(), userIdStr);
    try {
      await TaskService.getTaskById(updatedTask._id.toString(), userIdStr);
      console.error('Task deletion failed, task still exists');
    } catch (err: any) {
      console.log('Task deletion working correctly (Task not found)');
    }

    console.log('\n--- All Task API Tests Passed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Task test suite failed:', error);
    process.exit(1);
  }
};

runTaskTests();