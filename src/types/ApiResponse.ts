import { FeedbackPage } from "@/model/FeedbackPage";
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
  dashboardData?: DashboardData;
  avatar_url?: string;
  username?: string;
  shareableLink?: string;
  feedbacksData?: Array<FeedbackPage>;
  feedbackData?: FeedbackPage;
}

export interface DashboardData {
  totalVisits: number;
  uniqueVisitors: number;
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  trafficSources: { trafficSource: string; count: number }[];
  dailyVisits: { date: string; count: number }[];
  peakHours: { hour: string; count: number }[];
  osName: { os: string; count: number }[];
}
