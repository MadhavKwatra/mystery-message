"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import {
  Clipboard,
  ClipboardCheck,
  MessageCircle,
  Star,
  ChartBar
} from "lucide-react";
import axios from "axios";
import { type FeedbackPage } from "@/model/FeedbackPage";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function FeedbackPageComponent() {
  const { slug } = useParams();
  const [feedbackPage, setFeedbackPage] = useState<FeedbackPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchFeedbackPage() {
      try {
        const response = await axios.get(`/api/feedbacks/${slug}`);
        setFeedbackPage(response.data);
        toast({
          title: "Feedback Page Loaded",
          description: "Your feedback page is ready",
          variant: "default",
          duration: 3000
        });
      } catch (error) {
        console.error("Failed to fetch feedback page", error);
        toast({
          title: "Error",
          description: "Failed to load feedback page. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbackPage();
  }, [slug]);

  //   TODO : CHnage copy url accordingly

  const handleCopy = () => {
    navigator.clipboard.writeText(
      window.location.href.replace("feedbacks", "f")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Share Link",
      description: "Feedback page link copied to clipboard",
      variant: "default",
      duration: 2000
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4 animate-pulse">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!feedbackPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="p-8 bg-red-50 rounded-lg shadow-md">
          <p className="text-6xl mb-4">🚫</p>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Feedback Page Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The feedback page you$apos;re looking for might have been removed or
            doesn$apos;t exist.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center justify-center text-blue-600 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            {feedbackPage.title} <ChartBar className="w-8 h-8 text-blue-500" />
          </h1>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="hover:bg-gray-100 hover:dark:text-black transition-colors"
          >
            {copied ? (
              <ClipboardCheck className="w-10 h-10 text-green-500 mr-2" />
            ) : (
              <Clipboard className="w-10 h-10 mr-2" />
            )}
            Copy Link
          </Button>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {feedbackPage.description}
        </p>

        <div className="border-t pt-6 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 ">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            All Received Feedbacks
          </h2>

          {!feedbackPage.feedbacks || feedbackPage.feedbacks.length === 0 ? (
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <p className="text-gray-500 text-lg flex items-center justify-center gap-2">
                No feedbacks received yet. Share your feedback page to get
                responses! 🚀
              </p>
            </div>
          ) : (
            <div className="space-y-5 dark:bg-gray-900">
              {feedbackPage.feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-gray-50  dark:bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {feedback.answers.map((answer, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="font-medium flex items-center gap-2 text-gray-700">
                        {
                          feedbackPage.customQuestions.find(
                            (q) => q.id === answer.questionId
                          )?.question
                        }
                        {answer.type === "rating" && (
                          <Star className="w-5 h-5 text-yellow-500" />
                        )}
                      </p>
                      {answer.type === "rating" ? (
                        <StarRating value={Number(answer.response)} preview />
                      ) : (
                        <p className="text-gray-600">{answer.response}</p>
                      )}
                    </div>
                  ))}
                  {feedback.comment && (
                    <div className="mt-4 p-3 bg-white border rounded-md">
                      <p className="text-gray-600 italic">{feedback.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
