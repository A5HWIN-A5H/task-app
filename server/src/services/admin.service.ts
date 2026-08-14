import { User } from '../models/User';
import { Task } from '../models/Task';
import { ApiError } from '../utils/ApiError';

export class AdminService {
  static async getSystemStats() {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    
    const taskStats = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = {
      TODO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0
    };

    taskStats.forEach(stat => {
      if (stat._id === 'TODO') statusCounts.TODO = stat.count;
      if (stat._id === 'IN_PROGRESS') statusCounts.IN_PROGRESS = stat.count;
      if (stat._id === 'COMPLETED') statusCounts.COMPLETED = stat.count;
    });

    return { totalUsers, totalTasks, statusCounts };
  }

  static async getAllUsers() {
    return await User.find().select('-passwordHash').sort({ createdAt: -1 });
  }

  static async toggleUserStatus(userId: string, currentAdminId: string) {
    if (userId === currentAdminId) {
      throw ApiError.badRequest('You cannot disable your own admin account');
    }

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }
}