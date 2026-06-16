import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not found in environment variables. Database connection skipped.");
    mongoose.set('bufferCommands', false); // Disable buffering so queries fail immediately instead of hanging
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
