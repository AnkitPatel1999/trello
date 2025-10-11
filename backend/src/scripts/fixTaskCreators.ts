import mongoose from 'mongoose';
import { Task } from '../models/Task.model';
import { User } from '../models/User.model';
import dotenv from 'dotenv';

dotenv.config();

async function fixTaskCreators() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trello');
    console.log('Connected to MongoDB');

    // Get all tasks
    const tasks = await Task.find({}).select('_id userId title');
    console.log(`Found ${tasks.length} tasks`);

    // Get all users
    const users = await User.find({}).select('_id name email');
    console.log(`Found ${users.length} users`);

    // Create user map for quick lookup
    const userMap = new Map(users.map(user => [user._id.toString(), user]));

    let updatedCount = 0;
    let errorCount = 0;

    // Check each task
    for (const task of tasks) {
      try {
        const user = userMap.get(task.userId);
        
        if (!user) {
          console.log(`❌ Task "${task.title}" (${task._id}) has invalid userId: ${task.userId}`);
          errorCount++;
          continue;
        }

        if (!user.name || user.name === 'Unknown') {
          // Fix the user's name first
          const emailParts = user.email.split('@');
          if (emailParts.length > 0 && emailParts[0]) {
            const nameFromEmail = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
            await User.findByIdAndUpdate(user._id, { name: nameFromEmail });
            console.log(`✅ Fixed user ${user.email} name to: ${nameFromEmail}`);
          }
        }

        console.log(`✅ Task "${task.title}" created by: ${user.name || user.email}`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Error processing task ${task._id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully processed: ${updatedCount} tasks`);
    console.log(`❌ Errors: ${errorCount} tasks`);
    console.log('🎉 Task creator fix completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing task creators:', error);
    process.exit(1);
  }
}

// Run the script
fixTaskCreators();
