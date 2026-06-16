import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  hospitalName: string;
  logoUrl?: string;
  homeVideoUrl?: string;
  aboutUsImageUrl?: string;
  contactNumbers: string[];
  emails: string[];
  address: string;
  googleMapsLink?: string;
  whatsappNumber?: string;
  smtpConfig?: any;
  seoDefaults?: {
    metaTitle: string;
    description: string;
  };
  socialHandles?: {
    youtube?: string;
    instagram?: string;
  };
}

const SettingSchema: Schema = new Schema({
  hospitalName: { type: String, default: "Lake City Hospital" },
  logoUrl: { type: String },
  homeVideoUrl: { type: String },
  aboutUsImageUrl: { type: String },
  contactNumbers: [{ type: String }],
  emails: [{ type: String }],
  address: { type: String, default: "" },
  googleMapsLink: { type: String },
  whatsappNumber: { type: String },
  smtpConfig: { type: Schema.Types.Mixed },
  seoDefaults: {
    metaTitle: { type: String },
    description: { type: String }
  },
  socialHandles: {
    youtube: { type: String, default: "https://www.youtube.com/@lakecityhospitalbhopal" },
    instagram: { type: String, default: "https://www.instagram.com/lakecity.hospital/" }
  }
}, { timestamps: true });

export default mongoose.model<ISetting>("Setting", SettingSchema);
