import { connectDB } from '../config/database';
import { User } from '../models/User';

const promoteUser = async () => {
  await connectDB();
  
  const emailToPromote = 'strong@example.com'; 

  const user = await User.findOneAndUpdate(
    { email: emailToPromote },
    { role: 'ADMIN' },
    { new: true }
  );

  if (user) {
    console.log(`Success! ${user.name} is now an ADMIN.`);
  } else {
    console.log('User not found. Check the email address.');
  }
  process.exit(0);
};

promoteUser();