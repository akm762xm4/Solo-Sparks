import mongoose, { Schema, Document } from "mongoose";

export interface IRedemption extends Document {
  user: mongoose.Types.ObjectId;
  rewardId: string;
  rewardName: string;
  rewardDescription: string;
  cost: number;
  redeemedAt: Date;
  status: "active" | "expired" | "used";
  expiresAt?: Date;
}

const redemptionSchema = new Schema<IRedemption>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rewardId: {
    type: String,
    required: true,
  },
  rewardName: {
    type: String,
    required: true,
  },
  rewardDescription: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  redeemedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "expired", "used"],
    default: "active",
  },
  expiresAt: {
    type: Date,
  },
});

// Index for efficient queries
redemptionSchema.index({ user: 1, redeemedAt: -1 });
redemptionSchema.index({ user: 1, status: 1 });

export default mongoose.model<IRedemption>("Redemption", redemptionSchema);
