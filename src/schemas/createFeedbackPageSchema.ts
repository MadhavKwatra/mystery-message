import { z } from "zod";

export const createFeedbackPageSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().optional(),
  file: z.any().optional(),
  customQuestions: z.array(
    z.object({
      id: z.string().nanoid(),
      type: z.enum(["text", "rating"]),
      question: z.string().min(3, "Question is required"),
      options: z.array(z.string()).optional() // Only for multiple-choice
    })
  )
});
