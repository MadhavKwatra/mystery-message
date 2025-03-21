import { z } from "zod";

export const submitFeedbackSchema = z.object({
  rating: z.number().min(0.5, "Please select a rating"), // Ensure at least half a star is selected

  comment: z
    .string()
    .max(500, "Comment must be at most 500 characters")
    .optional(),

  experienceTags: z.array(z.string()).optional() // Example: ["Easy to use", "Buggy"]
});

export type FeedbackData = z.infer<typeof submitFeedbackSchema>;
