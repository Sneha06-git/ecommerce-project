const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: "admin@ecommerce.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create admin
        const admin = new User({
            name: "Admin",
            email: "admin@ecommerce.com",
            password: hashedPassword,
            phone: "9999999999",
            address: "Admin Office",
            role: "admin"
        });

        await admin.save();

        console.log("Admin account created successfully");
        console.log("Email: admin@ecommerce.com");
        console.log("Password: Admin@123");

    } catch (error) {

        console.log("Error creating admin:");
        console.log(error.message);

    } finally {

        await mongoose.connection.close();
        console.log("MongoDB connection closed");

    }
};

createAdmin();