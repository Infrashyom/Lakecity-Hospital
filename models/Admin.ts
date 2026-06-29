import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  otpCode?: string;
  otpExpiry?: Date;
  hospitalName?: string;
  logoUrl?: string;
  homeVideoUrl?: string;
  aboutUsImageUrl?: string;
  contactNumbers?: string[];
  emails?: string[];
  address?: string;
  googleMapsLink?: string;
  whatsappNumber?: string;
  smtpConfig?: any;
  seoDefaults?: {
    metaTitle?: string;
    description?: string;
  };
  socialHandles?: {
    youtube?: string;
    instagram?: string;
  };
}

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  otpCode: { type: String },
  otpExpiry: { type: Date },
  hospitalName: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  homeVideoUrl: { type: String, default: "" },
  aboutUsImageUrl: { type: String, default: "" },
  contactNumbers: { type: [String], default: [] },
  emails: { type: [String], default: [] },
  address: { type: String, default: "" },
  googleMapsLink: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  smtpConfig: { type: Schema.Types.Mixed },
  seoDefaults: {
    metaTitle: { type: String },
    description: { type: String }
  },
  socialHandles: {
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" }
  }
}, { timestamps: true });

export default mongoose.model<IAdmin>("Admin", AdminSchema);

