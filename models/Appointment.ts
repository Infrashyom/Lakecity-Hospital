import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  patientName: string;
  email: string;
  phone: string;
  doctorId: mongoose.Types.ObjectId;
  department?: string;
  date: Date;
  time: string;
  reason: string;
  notes?: string;
  status: "New" | "Called" | "Confirmed" | "Completed" | "Cancelled" | "No Response";
}

const AppointmentSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  department: { type: String, default: "General" },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  notes: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ["New", "Called", "Confirmed", "Completed", "Cancelled", "No Response"], 
    default: "New" 
  },
}, { timestamps: true });

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
