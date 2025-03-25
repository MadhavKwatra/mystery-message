// app/feedback/page.tsx
import { Metadata } from "next";
import FeedbackList from "./FeedbackList";

export const metadata: Metadata = {
  title: "Your Feedback Pages | Anonymous Feedback",
  description:
    "Manage and view your feedback pages easily. Create, update, and share feedback links.",
  openGraph: {
    title: "Your Feedback Pages",
    description:
      "Manage and view your feedback pages easily. Create, update, and share feedback links.",
    url: "https://yourdomain.com/feedback",
    siteName: "Anonymous Feedback",
    type: "website"
  }
};

export default function FeedbackPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-center">
        Your Feedback Pages
      </h1>
      <FeedbackList />
    </>
  );
}
