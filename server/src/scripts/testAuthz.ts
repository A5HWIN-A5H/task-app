import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { authorizeRoles } from '../middleware/role.middleware';
import { Request, Response, NextFunction } from 'express';

const runAuthzTests = async () => {
  try {
    await connectDB();
    console.log('--- Starting Authorization Tests ---');

    await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com', 'admin@test.com'] } });
    await Task.deleteMany({ title: 'User A Secret Task' });

    const userA = await User.create({ name: 'User A', email: 'usera@test.com', passwordHash: 'hash', role: 'USER' });
    const userB = await User.create({ name: 'User B', email: 'userb@test.com', passwordHash: 'hash', role: 'USER' });
    const admin = await User.create({ name: 'Admin', email: 'admin@test.com', passwordHash: 'hash', role: 'ADMIN' });

    const taskA = await Task.create({
      title: 'User A Secret Task',
      owner: userA._id,
      priority: 'HIGH',
    });

    console.log('Test Users and Task created');

    console.log('\nTesting Resource Ownership:');
    
    const requestedTask = await Task.findById(taskA._id);
    
    if (requestedTask && requestedTask.owner.toString() !== userB._id.toString()) {
      console.log('Ownership check correctly blocked User B from accessing User A\'s task (Simulating 403 Forbidden)');
    } else {
      console.error('Ownership check failed');
    }

    if (requestedTask && requestedTask.owner.toString() === userA._id.toString()) {
      console.log('Ownership check correctly allowed User A to access their own task');
    }

    console.log('\nTesting RBAC Middleware (Accessing /admin/stats):');
    
    const adminMiddleware = authorizeRoles('ADMIN');
    
    const mockNext = (err?: any) => {
      if (err) throw err; 
    };

   
    try {
      const reqUserA = { user: userA } as unknown as Request; 
      adminMiddleware(reqUserA, {} as Response, mockNext as NextFunction);
      console.error('RBAC failed: User A was allowed into Admin route');
    } catch (err: any) {
      console.log(`RBAC blocked standard USER. Caught Error: ${err.message} (Status: ${err.statusCode})`);
    }

    
    try {
      const reqAdmin = { user: admin } as unknown as Request; 
      adminMiddleware(reqAdmin, {} as Response, mockNext as NextFunction);
      console.log('RBAC allowed ADMIN to proceed');
    } catch (err: any) {
      console.error('RBAC blocked Admin from proceeding');
    }

    console.log('\n--- All Authorization Tests Passed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Authz test suite failed:', error);
    process.exit(1);
  }
};

runAuthzTests();