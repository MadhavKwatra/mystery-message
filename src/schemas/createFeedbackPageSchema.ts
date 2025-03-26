import { z } from "zod";

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export const createFeedbackPageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
          message: "Unsupported file type"
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "File size must be less than 5MB"
        })
    )
    .max(MAX_FILES, "Maximum 5 files allowed"),
  customQuestions: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(1, "Question is required"),
        type: z.enum(["text", "rating"])
      })
    )
    .optional()
});
