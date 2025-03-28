import mongoose, { Schema, Document } from "mongoose";

export interface Notification {
  userId: mongoose.Types.ObjectId;
  type: "anonymous-message" | "anonymous-feedback";
  message: string;
  redirectTo?: string;
  viewed: boolean;
  createdAt: Date;
  _id: mongoose.Types.ObjectId;
}
export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: "anonymous-message" | "anonymous-feedback";
  message: string;
  redirectTo?: string;
  viewed: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema<NotificationDocument> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["anonymous-message", "anonymous-feedback"],
    required: true
  },
  message: { type: String, required: true },
  redirectTo: { type: String },
  viewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<NotificationDocument>) ||
  mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default NotificationModel;
