import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Task } from '../models/Task';

const runTests = async () => {
  try {
    await connectDB();
    console.log('--- Starting Database Tests ---');

    
    await User.deleteMany({ email: 'test@example.com' });

    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'fakehash123',
    });
    console.log('User created successfully:', user._id);

    const task = await Task.create({
      title: 'Setup Database',
      description: 'Test Mongoose relationships',
      priority: 'HIGH',
      owner: user._id, 
    });
    console.log(' Task created successfully:', task.title);

    try {
      await Task.create({
        owner: user._id,
      });
      console.log('Validation failed to catch empty title');
    } catch (err: any) {
      console.log('Validation correctly caught missing task title');
    }

    console.log('--- Tests Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTests();