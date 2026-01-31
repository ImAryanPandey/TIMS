
import mongoose from 'mongoose';
import User from './models/User.js';

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected for Seeding...");
        
        const adminExists = await User.findOne({ role: 'Admin' });
        
        if (!adminExists) {
            await User.create({
                name: "System Admin",
                email: "admin@tims.com",
                mobile: "9999999999",
                password: "Admin@123!", 
                role: "Admin"
            });
            console.log("✅ Admin User Created Successfully");
        } else {
            console.log("ℹ️ Admin already exists");
        }
        
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedAdmin();