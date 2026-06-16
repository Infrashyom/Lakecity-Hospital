import mongoose, { Document, Schema } from "mongoose";

export interface IInsurance extends Document {
  name: string;
  isActive: boolean;
}

const insuranceSchema = new Schema<IInsurance>(
  {
    name: {
      type: String,
      required: [true, "An insurance provider must have a name"],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Insurance = mongoose.models.Insurance || mongoose.model<IInsurance>("Insurance", insuranceSchema);

export default Insurance;
