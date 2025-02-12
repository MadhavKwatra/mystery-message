import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const profileSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
});
