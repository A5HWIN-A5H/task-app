import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getSystemStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await AdminService.getSystemStats();
  res.status(200).json({ success: true, data: stats });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({ success: true, data: { users } });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await AdminService.toggleUserStatus(req.params.id as string, req.user!._id.toString());
  res.status(200).json({ 
    success: true, 
    message: `User ${user.isActive ? 'activated' : 'disabled'} successfully`,
    data: { user } 
  });
});