import mongoose, { Schema, Document } from "mongoose";

export interface IAdminOTP extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

const AdminOTPSchema: Schema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 5 minutes expiry
});

export default mongoose.model<IAdminOTP>("AdminOTP", AdminOTPSchema);
