import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  sourcePage?: string;
  message?: string;
  assignedTo?: string;
  status: "New" | "Contacted" | "Interested" | "Converted" | "Closed";
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  sourcePage: { type: String },
  message: { type: String },
  assignedTo: { type: String },
  status: { 
    type: String, 
    enum: ["New", "Contacted", "Interested", "Converted", "Closed"], 
    default: "New" 
  },
}, { timestamps: true });

export default mongoose.model<ILead>("Lead", LeadSchema);
