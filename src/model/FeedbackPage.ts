import mongoose, { Model, Schema } from "mongoose";
import { nanoid } from "nanoid";
import slugify from "slugify";

interface CustomQuestion {
  id: string;
  question: string;
  type: "text" | "rating";
}

// TODO: Add views clicks or whatever you need?
export interface FeedbackPage extends Document {
  _id: string;
  title: string;
  description: string;
  link?: string;
  files: string[]; // Array of Cloudinary URLs
  customQuestions: CustomQuestion[];
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  slug: string;
  feedbacks: Feedback[];
}

const FeedbackSchema = new Schema<Feedback>(
  {
    answers: [
      {
        questionId: { type: String, required: true },
        response: { type: Schema.Types.Mixed, required: true }, // Accepts text or rating number
        type: { type: String, enum: ["text", "rating"], required: true }
      }
    ],
    comment: { type: String }
  },
  { timestamps: true }
);

const FeedbackPageSchema: Schema<FeedbackPage> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customQuestions: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        type: { type: String, enum: ["text", "rating"], required: true }
      }
    ],
    slug: {
      type: String,
      unique: true,
      default: function () {
        return `${slugify(this.title, { lower: true, strict: true })}-${nanoid(6)}`;
      }
    },
    feedbacks: { type: [FeedbackSchema], default: [] } // Embedded anonymous feedbacks
  },
  { timestamps: true }
);

interface FeedbackAnswer {
  questionId: string;
  response: string | number; // Text response or rating (1-5)
  type: "text" | "rating";
}

interface Feedback {
  answers: FeedbackAnswer[];
  comment?: string; // Optional long text feedback
  createdAt: Date;
}

const FeedbackPage: Model<FeedbackPage> =
  (mongoose.models.FeedbackPage as mongoose.Model<FeedbackPage>) ||
  mongoose.model<FeedbackPage>("FeedbackPage", FeedbackPageSchema);

export default FeedbackPage;
