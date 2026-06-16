import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: string;
  education?: string[];
  affiliations?: string[];
  publications?: string[];
  bio?: string;
  // New CRM Fields
  languages?: string[];
  registrationNumber?: string;
  expertise?: string[];
  awards?: string[];
  surgeriesCount?: number;
  opdTiming?: string;
  consultationFees?: number;
  
  // Digital Growth Data
  profileViews?: number;
  appointmentRequests?: number;
  isTopSearched?: boolean;
  
  // Controls
  isActive?: boolean;
  featureOnHomepage?: boolean;
  priorityOrder?: number;
  department?: mongoose.Types.ObjectId;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  experience: { type: String, required: true },
  availability: { type: String, required: true },
  education: [{ type: String }],
  affiliations: [{ type: String }],
  publications: [{ type: String }],
  bio: { type: String },
  
  // New CRM Fields
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  languages: [{ type: String }],
  registrationNumber: { type: String },
  expertise: [{ type: String }],
  awards: [{ type: String }],
  surgeriesCount: { type: Number, default: 0 },
  opdTiming: { type: String },
  consultationFees: { type: Number, default: 500 },
  
  // Digital Growth Data
  profileViews: { type: Number, default: 0 },
  appointmentRequests: { type: Number, default: 0 },
  isTopSearched: { type: Boolean, default: false },
  
  // Controls
  isActive: { type: Boolean, default: true },
  featureOnHomepage: { type: Boolean, default: false },
  priorityOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
