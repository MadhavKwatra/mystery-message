import mongoose, { Document, Schema, Model } from "mongoose";

export interface Visit extends Document {
  userId: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  device?: string;
  trafficSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrackingSchema: Schema<Visit> = new Schema(
  {
    userId: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
    device: { type: String },
    trafficSource: { type: String },
  },
  { timestamps: true }
);

const Visit: Model<Visit> =
  (mongoose.models.Visit as mongoose.Model<Visit>) ||
  mongoose.model<Visit>("Visit", TrackingSchema);

export default Visit;
