import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://expense:expense@expensetracker.j2a6e1c.mongodb.net/Expense"
    ).then(() => {
        console.log("MongoDB connected");
    } )  
};

export default connectDB;