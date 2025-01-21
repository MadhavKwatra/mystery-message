import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be atleast 10 characters")
    .max(1000, "Content must be no more than 300 characters"),
});
