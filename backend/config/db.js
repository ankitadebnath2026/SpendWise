import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://expense:expense@expensetracker.j2a6e1c.mongodb.net/Expense";
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;
