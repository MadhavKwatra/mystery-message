import { z } from "zod";

export const submitFeedbackSchema = z.object({
  rating: z
    .number()
    .min(0.5, "Please select a rating")
    .max(5, "Rating cannot exceed 5 stars"),

  comment: z
    .string()
    .trim()
    .max(500, "Comment must be at most 500 characters")
    .optional(),

  experienceTags: z
    .array(z.string())
    .max(5, "You can select up to 5 experience tags")
    .optional(),

  // Optional: Add more specific validation for experience tags
  experienceTagsConstraints: z
    .array(z.string())
    .refine(
      (tags) => {
        const allowedTags = [
          "Easy to use",
          "Intuitive Design",
          "Needs Improvement",
          "Complicated",
          "Buggy",
          "Fast Performance",
          "Great Features"
        ];
        return tags.every((tag) => allowedTags.includes(tag));
      },
      { message: "One or more selected tags are invalid" }
    )
    .optional()
});

export type FeedbackData = z.infer<typeof submitFeedbackSchema>;
