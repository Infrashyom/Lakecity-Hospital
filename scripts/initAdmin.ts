import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.ts";

dotenv.config();

const initAdmin = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!MONGODB_URI || !adminEmail || !adminPassword) {
    console.error("Missing environment variables (MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD)");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for admin initialization");

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists. Updating password...");
      const salt = await bcrypt.genSalt(10);
      existingAdmin.passwordHash = await bcrypt.hash(adminPassword, salt);
      await existingAdmin.save();
      console.log("Admin password updated successfully.");
    } else {
      console.log("Creating new admin...");
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      await Admin.create({ email: adminEmail, passwordHash });
      console.log("Admin created successfully.");
    }

  } catch (err) {
    console.error("Error during admin initialization:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

initAdmin();
