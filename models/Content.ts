import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  type: "blog" | "media" | "tour";
  title?: string;
  name?: string;
  slug?: string;
  content?: string; // HTML or Markdown
  image?: string;
  description?: string;
  category?: string;
  author?: string;
  showOnHome?: boolean;
  hotspots?: any[];
}

const ContentSchema: Schema = new Schema({
  type: { type: String, enum: ["blog", "media", "tour"], required: true },
  title: { type: String },
  name: { type: String },
  slug: { type: String, unique: false, sparse: true },
  content: { type: String },
  image: { type: String },
  description: { type: String },
  category: { type: String },
  author: { type: String },
  showOnHome: { type: Boolean, default: false },
  hotspots: { type: Array, default: function(this: any) { return this.type === 'tour' ? [] : undefined; } },
}, { timestamps: true });

export default mongoose.model<IContent>("Content", ContentSchema);
