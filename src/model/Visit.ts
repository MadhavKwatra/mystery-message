import mongoose, { Document, Schema, Model } from "mongoose";

export interface Visit extends Document {
  userId?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  device?: string;
  trafficSource?: string;
  isFeedbackPage?: boolean;
  osName?: string;
  createdAt: Date;
  updatedAt: Date;
  feedbackPageId?: string; // New field to associate with feedback page
}

const TrackingSchema: Schema<Visit> = new Schema(
  {
    userId: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
    device: { type: String },
    trafficSource: { type: String },
    osName: { type: String },
    isFeedbackPage: { type: Boolean, default: false },
    feedbackPageId: { type: String, default: null } // Stores feedback page ID
  },
  { timestamps: true }
);
// TODO: Add call to visits from feedback visit
const Visit: Model<Visit> =
  (mongoose.models.Visit as mongoose.Model<Visit>) ||
  mongoose.model<Visit>("Visit", TrackingSchema);

export default Visit;
