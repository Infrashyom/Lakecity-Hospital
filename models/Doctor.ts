import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  image: string;
  experience: number;
  availability: string;
  education?: string[];
  affiliations?: string[];
  publications?: string[];
  bio?: string;
  languages?: string[];
  registrationNumber?: string;
  expertise?: string[];
  awards?: string[];
  surgeriesCount?: number;
  opdTiming?: string;
  consultationFees?: number;
  
  // Controls
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
  department?: mongoose.Types.ObjectId;
  showOnHome?: boolean;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: String, default: "" },
  experience: { type: Number, required: true },
  availability: { type: String, required: true },
  education: [{ type: String }],
  affiliations: [{ type: String }],
  publications: [{ type: String }],
  bio: { type: String },
  
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  languages: [{ type: String }],
  registrationNumber: { type: String },
  expertise: [{ type: String }],
  awards: [{ type: String }],
  surgeriesCount: { type: Number, default: 0 },
  opdTiming: { type: String },
  consultationFees: { type: Number, default: 500 },
  
  // Controls
  status: { type: String, enum: ["ACTIVE", "INACTIVE", "BANNED"], default: "ACTIVE" },
  showOnHome: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
