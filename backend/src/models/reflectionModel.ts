import mongoose, { Document, Schema } from "mongoose";

export interface IReflection extends Document {
  user: mongoose.Types.ObjectId;
  questTitle: string;
  questType: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  qualityScore?: number;
  createdAt: Date;
}

const reflectionSchema = new Schema<IReflection>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questTitle: { type: String, required: true },
    questType: { type: String, required: true },
    text: { type: String },
    imageUrl: { type: String },
    audioUrl: { type: String },
    qualityScore: { type: Number },
  },
  { timestamps: true }
);

const Reflection = mongoose.model<IReflection>("Reflection", reflectionSchema);
export default Reflection;
