// schemas/submitFeedbackSchema.ts
import { z } from "zod";

export const answerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  response: z.union([z.string().trim().max(500), z.number().min(1).max(5)]),
  type: z.enum(["text", "rating"])
});

export const customQuestionResponseSchema = z
  .object({
    questionId: z.string().min(1, "Question ID is required"),
    type: z.enum(["text", "rating"]),
    response: z.union([
      z.string().trim().max(500, "Response must be at most 500 characters"),
      z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5 stars")
    ])
  })
  .refine(
    (data) => {
      if (data.type === "text") return typeof data.response === "string";
      if (data.type === "rating") return typeof data.response === "number";
      return false;
    },
    {
      message: "Invalid response type for the question"
    }
  );

export const submitFeedbackSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be at most 500 characters")
    .optional(),

  customQuestions: z.array(customQuestionResponseSchema).optional()
});

export type FeedbackData = z.infer<typeof submitFeedbackSchema>;
export type Answer = z.infer<typeof answerSchema>;
