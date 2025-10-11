import mongoose from 'mongoose';
import { User } from '../models/User.model';
import dotenv from 'dotenv';

dotenv.config();

async function fixUserNames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trello');
    console.log('Connected to MongoDB');

    // Find users with missing or empty names
    const usersWithMissingNames = await User.find({
      $or: [
        { name: { $exists: false } },
        { name: null },
        { name: '' },
        { name: 'Unknown' }
      ]
    });

    console.log(`Found ${usersWithMissingNames.length} users with missing names`);

    // Update each user with a proper name
    for (const user of usersWithMissingNames) {
      const email = user.email as string;
      const userId = user._id as string;
      
      if (email && userId) {
        const emailParts = email.split('@');
        if (emailParts.length > 0 && emailParts[0]) {
          const nameFromEmail = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
          
          await User.findByIdAndUpdate(userId, {
            name: nameFromEmail
          });

          console.log(`Updated user ${email} with name: ${nameFromEmail}`);
        }
      }
    }

    console.log('All user names have been fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing user names:', error);
    process.exit(1);
  }
}

// Run the script
fixUserNames();
