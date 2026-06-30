import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  patientName: string;
  age: number;
  email?: string;
  phone: string;
  doctorId?: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  reason: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

const AppointmentSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: false },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Cancelled"], 
    default: "Pending" 
  },
}, { timestamps: true });

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
