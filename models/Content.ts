import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  type: "blog" | "page" | "media" | "tour";
  title?: string;
  name?: string;
  slug?: string;
  content?: string; // HTML or Markdown
  image?: string;
  description?: string;
  category?: string;
  author?: string;
  views?: number;
  isPublished?: boolean;
  showOnHome?: boolean;
  hotspots?: any[];
}

const ContentSchema: Schema = new Schema({
  type: { type: String, enum: ["blog", "page", "media", "tour"], required: true },
  title: { type: String },
  name: { type: String },
  slug: { type: String, unique: false, sparse: true },
  content: { type: String },
  image: { type: String },
  description: { type: String },
  category: { type: String },
  author: { type: String },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  showOnHome: { type: Boolean, default: false },
  hotspots: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model<IContent>("Content", ContentSchema);
