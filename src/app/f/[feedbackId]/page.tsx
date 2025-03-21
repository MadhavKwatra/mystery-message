"use client";

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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitFeedbackSchema } from "@/schemas/submitFeedbackSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Send, Star, FileText, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StarRating from "@/components/StarRating";
const dummyFeedbackDetails = {
  title: "Website Usability Feedback",
  description:
    "Please share your thoughts on the new website design. Let us know what's working and what needs improvement.",
  files: [
    {
      url: "https://via.placeholder.com/150", // Example image URL
      name: "screenshot.png",
      type: "image/png"
    },
    {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Example PDF URL
      name: "user-report.pdf",
      type: "application/pdf"
    }
  ]
};

function AnonymousFeedbackForm() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ feedbackId: string }>();
  const { feedbackId } = params;

  const [feedbackDetails, setFeedbackDetails] = useState<{
    title: string;
    description: string;
    files: { url: string; name: string; type: string }[]; // Added files field
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await axios.get<{
        //   title: string;
        //   description: string;
        //   files: { url: string; name: string; type: string }[];
        // }>(`/api/feedback/${feedbackId}`);
        // setFeedbackDetails(response.data);
        // Simulate API loading delay
        setTimeout(() => {
          setFeedbackDetails(dummyFeedbackDetails);
          setLoading(false);
        }, 1000); // Simulate network delay
      } catch (err) {
        setError("Failed to load feedback details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [feedbackId]);

  const form = useForm<z.infer<typeof submitFeedbackSchema>>({
    resolver: zodResolver(submitFeedbackSchema),
    defaultValues: {
      rating: 0,
      comment: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof submitFeedbackSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/submit-feedback`, {
        feedbackId,
        rating: data.rating,
        comment: data.comment
      });

      toast({
        title: "Feedback Submitted",
        description: response.data.message
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting feedback", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Submission failed",
        description:
          axiosError.response?.data.message || "Something went wrong.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-5 md:my-8 mx-auto md:p-6 bg-white rounded max-w-2xl pt-16 dark:bg-gray-900">
      {/* Heading & Instructions */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-center">
          Share Your Anonymous Feedback
        </h1>
        <p className="text-gray-400 mt-4 text-justify">
          The user has requested feedback on the following topic. Your honest
          and constructive input will help improve their work.
          <br />
          Please review the details below, rate their work, and leave your
          thoughts in the comment section.
          <br />
          Any attached files are provided as reference material.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">{feedbackDetails?.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              {feedbackDetails?.description}
            </p>
            {/* Uploaded Files Section */}

            {feedbackDetails?.files && feedbackDetails?.files.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className="font-semibold text-lg">Attachments</h3>
                <div className="mt-2 space-y-2">
                  {feedbackDetails.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name}
                        </span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Star Rating Field */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xl">
                  Rate Your Experience
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comment Input */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xl">
                  Leave a Comment
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your feedback here..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="font-bold w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-5 dark:text-white"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Feedback
              </>
            )}
          </Button>
        </form>
      </Form>
      <Separator className="my-6" />
      <p className="text-center text-sm text-gray-600">
        Your feedback is anonymous. Be constructive and respectful.
      </p>
    </div>
  );
}

export default AnonymousFeedbackForm;
