require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function initDB() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create sample users
        const sampleUsers = [
            {
                username: 'sales1',
                password: 'sales123',
                role: 'SALES',
                email: 'sales1@example.com'
            },
            {
                username: 'sales2',
                password: 'sales456',
                role: 'SALES',
                email: 'sales2@example.com'
            },
            {
                username: 'teacher1',
                password: 'teacher123',
                role: 'TEACHER',
                email: 'teacher1@example.com'
            },
            {
                username: 'teacher2',
                password: 'teacher456',
                role: 'TEACHER',
                email: 'teacher2@example.com'
            }
        ];

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Insert new users
        for (const user of sampleUsers) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({
                username: user.username,
                password_hash: hashedPassword,
                role: user.role,
                email: user.email
            });
            console.log(`Created user: ${user.username}`);
        }

        console.log('Sample users created successfully');
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB(); 