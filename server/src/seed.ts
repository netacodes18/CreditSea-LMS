import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Role } from './models/User';
import { connectDB } from './config/db';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = [
      { email: 'admin@example.com', passwordHash, role: Role.ADMIN },
      { email: 'sales@example.com', passwordHash, role: Role.SALES },
      { email: 'sanction@example.com', passwordHash, role: Role.SANCTION },
      { email: 'disbursement@example.com', passwordHash, role: Role.DISBURSEMENT },
      { email: 'collection@example.com', passwordHash, role: Role.COLLECTION },
      { email: 'borrower@example.com', passwordHash, role: Role.BORROWER },
    ];
    
    await User.insertMany(users);
    
    console.log('Database seeded successfully with test accounts!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
