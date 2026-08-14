import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
    res.status(400).json({
      success: false,
      message: 'Access denied: Only @gmail.com addresses are allowed.',
    });
    return;
  }

  const result = await AuthService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
    res.status(400).json({
      success: false,
      message: 'Access denied: Only @gmail.com addresses are allowed.',
    });
    return;
  }

  const result = await AuthService.login(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved',
    data: {
      user: req.user,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please discard token on client.',
  });
});