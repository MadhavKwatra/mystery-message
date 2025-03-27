"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  submitFeedbackSchema,
  type FeedbackData,
  type Answer
} from "@/schemas/submitFeedbackSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, FileText, Download, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import { z } from "zod";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";

// Define the types based on the provided model
interface CustomQuestion {
  id: string;
  question: string;
  type: "text" | "rating";
  _id?: string;
}

interface FeedbackPageData {
  _id: string;
  title: string;
  description: string;
  link?: string;
  files?: string[];
  customQuestions: CustomQuestion[];
  createdBy: string;
  slug: string;
}

export default function SendAnonymousFeedback() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ feedbackSlug: string }>();
  const { feedbackSlug } = params;

  // beaconAPI for analytics
  useEffect(() => {
    function trackVisit() {
      const data = JSON.stringify({
        feedbackPageId: feedbackSlug,
        isFeedbackPage: true
      });
      // Send data to the analytics API without blocking page load
      navigator.sendBeacon("/api/track-visit", data);
    }
    trackVisit();
  }, [feedbackSlug]);
  const [feedbackDetails, setFeedbackDetails] =
    useState<FeedbackPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customResponses, setCustomResponses] = useState<
    Record<string, string | number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a dynamic schema based on the custom questions
  const createDynamicSchema = (customQuestions: CustomQuestion[]) => {
    return z.object({
      comment: z
        .string()
        .trim()
        .min(10, "Comment must be at least 10 characters")
        .max(500, "Comment must be at most 500 characters")
        .optional(),
      customQuestions: z
        .array(
          z.object({
            questionId: z.string(),
            response: z.union([z.string(), z.number()]),
            type: z.enum(["text", "rating"])
          })
        )
        .optional()
    });
  };

  // Initialize the form with default values
  const form = useForm<FeedbackData>({
    resolver: zodResolver(submitFeedbackSchema),
    defaultValues: {
      comment: "",
      customQuestions: []
    },
    mode: "onChange"
  });

  // Add this useEffect to update form validation when customResponses change
  useEffect(() => {
    if (feedbackDetails?.customQuestions) {
      // Convert customResponses to the format expected by the form
      const formattedQuestions = Object.entries(customResponses).map(
        ([questionId, response]) => ({
          questionId,
          response,
          type: typeof response === "number" ? "rating" : "text"
        })
      );

      // Set the value in the form
      form.setValue("customQuestions", formattedQuestions);

      // Trigger validation
      form.trigger("customQuestions");
    }
  }, [customResponses, feedbackDetails, form]);

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/feedbacks/${feedbackSlug}`
        );

        console.log(response, "Fetch feedback data");
        setFeedbackDetails(response.data?.feedbackData || null);
        toast({
          title: "Success",
          description: "Feedback form loaded successfully",
          variant: "default",
          duration: 2000
        });
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback form",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (feedbackSlug) {
      fetchFeedbackDetails();
    }
  }, [feedbackSlug, toast]);

  // Update the onSubmit function to validate custom questions before submission
  const onSubmit = async (data: FeedbackData) => {
    // Check if all required custom questions are answered
    const unansweredQuestions = feedbackDetails?.customQuestions.filter(
      (question) => !customResponses[question.id]
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please answer all questions before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Transform the customResponses into the format expected by the API
      const answers: Answer[] = Object.entries(customResponses).map(
        ([questionId, response]) => ({
          questionId,
          response,
          type: typeof response === "number" ? "rating" : "text"
        })
      );

      const payload = {
        comment: data.comment,
        answers,
        slug: feedbackSlug
      };

      console.log(payload, "Submission payload");

      const response = await axios.post<ApiResponse>(
        `/api/send-feedback`,
        payload
      );

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable input!",
        duration: 3000
      });

      form.reset();
      setCustomResponses({});
    } catch (error) {
      console.error("Error in sending feedback", error);

      const axiosError = error as AxiosError<ApiResponse<any>>;
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: "Submission Failed",
        description:
          errorMessage || "An error occurred while submitting your feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleCustomQuestionResponse function to validate after setting state
  const handleCustomQuestionResponse = (
    questionId: string,
    value: string | number,
    type: "text" | "rating"
  ) => {
    if (!questionId) {
      console.error("Invalid question ID provided.");
      return;
    }

    setCustomResponses((prev) => {
      const updated = {
        ...prev,
        [questionId]: value
      };

      return updated;
    });
  };

  if (loading || !feedbackDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-5 md:my-8 mx-auto md:p-6 bg-white rounded max-w-2xl dark:bg-gray-900">
      {/* Feedback Form Header */}
      <div className="text-center mb-8 bg-gray-50 p-6 rounded-lg dark:bg-gray-800 ">
        <h1 className="text-4xl font-bold mb-4">
          Share Your Honest Feedback
          <span role="img" aria-label="megaphone" className="ml-3">
            🗣️
          </span>
        </h1>
        <p className="text-lg dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
          We&apos;re committed to continuous improvement, and your candid
          insights are the key to making our product or service better. This
          anonymous feedback form allows you to share your genuine experiences,
          suggestions, and perspectives without hesitation.
        </p>
        <div className="flex justify-center items-center mt-4 space-x-2">
          <span role="img" aria-label="shield" className="text-2xl">
            🛡️
          </span>
          <span className="text-sm text-gray-500">
            Your feedback is 100% anonymous and confidential
          </span>
        </div>
      </div>

      {/* Specific Feedback Details */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4">{feedbackDetails.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {feedbackDetails.description}
        </p>

        {feedbackDetails.link && (
          <div className="mt-4">
            <a
              href={feedbackDetails.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              <LinkIcon className="mr-2 w-5 h-5" />
              Related Link
            </a>
          </div>
        )}
      </div>

      {/* Attachments */}
      {feedbackDetails.files && feedbackDetails.files.length > 0 && (
        <Card className="mb-6 dark:bg-gray-800">
          <CardHeader className="font-semibold">Attachments</CardHeader>
          <CardContent>
            {feedbackDetails.files.map((url, index) => {
              // Extract filename from secure_url
              const fileName = url.split("/").pop()?.split("?")[0] || "file";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg mb-2 dark:bg-gray-900 bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-500" />
                    <span>{fileName}</span>
                  </div>
                  <a
                    href={url}
                    download
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Download className="mr-2 w-4 h-4" /> Download
                  </a>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Update the custom questions rendering to show validation errors */}
          {feedbackDetails.customQuestions &&
            feedbackDetails.customQuestions.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Custom Questions</h2>
                {feedbackDetails.customQuestions.map((question, index) => (
                  <div key={question.id} className="mb-4">
                    <FormLabel className="text-lg font-semibold">
                      {question.question}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="mt-2">
                      {question.type === "text" ? (
                        <Textarea
                          placeholder="Your response..."
                          value={(customResponses[question.id] as string) || ""}
                          onChange={(e) => {
                            handleCustomQuestionResponse(
                              question.id,
                              e.target.value,
                              "text"
                            );
                          }}
                          className={`w-full ${!customResponses[question.id] ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                      ) : (
                        <StarRating
                          value={(customResponses[question.id] as number) || 0}
                          onChange={(value) => {
                            handleCustomQuestionResponse(
                              question.id,
                              value,
                              "rating"
                            );
                          }}
                        />
                      )}
                      {!customResponses[question.id] && (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          This question is required
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold">
                  Additional Comments
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your detailed thoughts..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Update the submit button to be disabled if there are unanswered questions */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:text-white font-bold"
            disabled={
              isSubmitting ||
              feedbackDetails?.customQuestions.some(
                (q) => !customResponses[q.id]
              )
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Feedback
              </>
            )}
          </Button>
        </form>
      </Form>

      <Separator className="my-6" />
      <p className="text-center text-sm text-gray-600">
        Your feedback is anonymous and greatly appreciated. Be constructive and
        respectful.
      </p>
    </div>
  );
}
