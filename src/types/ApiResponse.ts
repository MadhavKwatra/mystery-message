import { Message } from "@/model/User";

// Defining api responses
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  details?: {
    avatar_url: string;
    username: string;
    email: string;
  };
  avatar_url?: string;
}
