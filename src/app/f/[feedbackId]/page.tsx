"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitFeedbackSchema } from "@/schemas/submitFeedbackSchema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send, FileText, Download, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
type CheckedState = boolean | "indeterminate";

// Dummy experience tags
const EXPERIENCE_TAGS = [
  "Easy to use",
  "Intuitive Design",
  "Needs Improvement",
  "Complicated",
  "Buggy",
  "Fast Performance",
  "Great Features"
] as const;

// Dummy feedback form details
const dummyFeedbackDetails = {
  id: "feedback-123",
  title: "Website Usability Feedback",
  description:
    "We're looking to improve our user experience. Your honest feedback is crucial!",
  link: "https://example.com/product",
  files: [
    {
      url: "/api/placeholder/150/150",
      name: "screenshot.png",
      type: "image/png"
    }
  ],
  customQuestions: [
    {
      id: "q1",
      type: "text",
      question: "What specific feature would you like to see improved?"
    },
    {
      id: "q2",
      type: "rating",
      question: "How easy was the navigation?"
    }
  ]
};

export default function AnonymousFeedbackForm() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ feedbackId: string }>();
  const { feedbackId } = params;

  const [feedbackDetails, setFeedbackDetails] = useState(dummyFeedbackDetails);
  const [loading, setLoading] = useState(true);
  const [customResponses, setCustomResponses] = useState<{
    [key: string]: any;
  }>({});

  const form = useForm({
    resolver: zodResolver(submitFeedbackSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      experienceTags: []
    }
  });

  useEffect(() => {
    // Simulate fetching feedback form details
    const fetchFeedbackDetails = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/feedback/${feedbackId}`);
        // const data = await response.json();
        // setFeedbackDetails(data);

        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load feedback form",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [feedbackId, toast]);

  const onSubmit = async (data: any) => {
    try {
      // Combine main feedback data with custom question responses
      const fullSubmission = {
        ...data,
        customResponses,
        feedbackFormId: feedbackDetails.id
      };

      // TODO: Replace with actual API submission
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fullSubmission)
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your valuable input!"
        });
        router.push("/feedback-submitted");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your feedback",
        variant: "destructive"
      });
    }
  };

  const handleCustomQuestionResponse = (questionId: string, value: any) => {
    setCustomResponses((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  if (loading) {
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
        <h1 className="text-4xl font-bold  mb-4">
          Share Your Honest Feedback
          <span role="img" aria-label="megaphone" className="ml-3">
            🗣️
          </span>
        </h1>
        <p className="text-lg dark:text-gray-300 text-gray-600  max-w-2xl mx-auto">
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
            {feedbackDetails.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3  rounded-lg mb-2 dark:bg-gray-900 bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-500" />
                  <span>{file.name}</span>
                </div>
                <a
                  href={file.url}
                  download
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Download className="mr-2 w-4 h-4" /> Download
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Custom Questions */}
          {feedbackDetails.customQuestions?.map((question) => (
            <div key={question.id} className="space-y-2">
              <FormLabel className="text-lg font-semibold">
                {question.question}
              </FormLabel>
              {question.type === "text" && (
                <Textarea
                  placeholder="Your response..."
                  onChange={(e) =>
                    handleCustomQuestionResponse(question.id, e.target.value)
                  }
                />
              )}
              {question.type === "rating" && (
                <StarRating
                  value={customResponses[question.id] || 0}
                  onChange={(value) =>
                    handleCustomQuestionResponse(question.id, value)
                  }
                />
              )}
            </div>
          ))}

          {/* Overall Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold">
                  Overall Rating
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Experience Tags */}
          <div className="space-y-2">
            <FormLabel className="text-xl font-bold">Experience Tags</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {EXPERIENCE_TAGS.map((tag) => (
                <FormField
                  key={tag}
                  control={form.control}
                  name="experienceTags"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={tag}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(tag)}
                            onCheckedChange={(checked: CheckedState) => {
                              return checked === true
                                ? field.onChange([...(field.value || []), tag])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== tag
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{tag}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          {/* TODO : CHange to rich text editor */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:text-white font-bold"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
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
