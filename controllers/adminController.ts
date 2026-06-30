import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Helper to send email
async function sendOTPEmail(email: string, code: string) {
  try {
    const admin = await Admin.findOne();
    const smtpConfig = admin?.smtpConfig;

    if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
      console.warn("SMTP credentials not configured in settings. Skipping email.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const mailOptions = {
      from: `"Lake City Admin" <${smtpConfig.user}>`,
      to: email,
      subject: "Your Admin Verification Code",
      text: `Your verification code is: ${code}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Lake City Caring Partners</h2>
          <p>You are attempting to access the Admin Panel.</p>
          <p>Your verification code is:</p>
          <h1 style="color: #004b5a; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not request this, please secure your account.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(new AppError("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otpCode = otpCode;
  admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await admin.save();

  // Send Email
  const emailSent = await sendOTPEmail(email, otpCode);
  
  if (!emailSent) {
    console.log(`[DEV ONLY] OTP for ${email}: ${otpCode}`);
  }

  res.json({ 
    message: "Credentials verified. OTP sent to your email.",
    email,
    requires2fa: true 
  });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body;

  const admin = await Admin.findOne({ email, otpCode: code });
  
  if (!admin || !admin.otpExpiry || admin.otpExpiry < new Date()) {
    return next(new AppError("Invalid or expired code", 400));
  }

  // Success - clean up OTP
  admin.otpCode = undefined;
  admin.otpExpiry = undefined;
  await admin.save();

  // Generate JWT
  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, admin: { email: admin.email } });
});

export const checkAdminExists = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const adminCount = await Admin.countDocuments();
  res.json({ exists: adminCount > 0 });
});

export const setupInitialAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, setupKey } = req.body;
  const adminCount = await Admin.countDocuments();
  
  if (adminCount > 0 && setupKey !== process.env.JWT_SECRET) {
    return next(new AppError("Unauthorized. Admin already exists.", 403));
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return next(new AppError("Admin email already registered", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await Admin.create({ 
    email, 
    passwordHash,
    hospitalName: "Lake City Hospital",
    contactNumbers: [],
    emails: []
  });

  res.status(201).json({ message: "Admin created successfully", admin: { email: admin.email } });
});

export const requestPasswordChangeOtp = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    return next(new AppError("Not authorized", 401));
  }
  const admin = await Admin.findById(req.user.id);
  if (!admin) return next(new AppError("Admin not found", 404));

  const { currentPassword } = req.body;
  if (!currentPassword) return next(new AppError("Current password is required", 400));
  
  const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isMatch) return next(new AppError("Incorrect current password", 401));

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otpCode = otpCode;
  admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await admin.save();

  // Send Email
  const emailSent = await sendOTPEmail(admin.email, otpCode);
  
  if (!emailSent) {
    console.log(`[DEV ONLY] Password Change OTP for ${admin.email}: ${otpCode}`);
  }

  res.json({ 
    message: "OTP sent to your email.",
    requires2fa: true 
  });
});

export const changePassword = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword, otpCode } = req.body;
  
  if (!req.user?.id) {
    return next(new AppError("Not authorized", 401));
  }
  
  const admin = await Admin.findById(req.user.id);

  if (!admin) return next(new AppError("Admin not found", 404));

  if (!otpCode) return next(new AppError("OTP code is required", 400));

  if (admin.otpCode !== otpCode || !admin.otpExpiry || admin.otpExpiry < new Date()) {
    return next(new AppError("Invalid or expired verification code", 401));
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isMatch) return next(new AppError("Incorrect current password", 401));

  const salt = await bcrypt.genSalt(10);
  admin.passwordHash = await bcrypt.hash(newPassword, salt);
  admin.otpCode = undefined;
  admin.otpExpiry = undefined;
  await admin.save();

  res.json({ message: "Password updated successfully" });
});
