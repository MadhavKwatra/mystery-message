"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Link as LinkIcon,
  Trash2,
  ArrowLeft,
  Eye,
  EyeClosed
} from "lucide-react";
import { Toast, useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import FileUploader from "@/components/FileUploader";
import { createFeedbackPageSchema } from "@/schemas/createFeedbackPageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import CopyLink from "@/components/CopyLink";

// --- ShareableLinkModal Component ---
type ShareableLinkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareableLink: string;
  toast: (props: Toast) => void; // ✅ Correct typing for toast function
};

const ShareableLinkModal = ({
  open,
  onOpenChange,
  shareableLink
}: ShareableLinkModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback Page Created 🎉</DialogTitle>
          <DialogDescription>
            Your feedback page is ready! Copy the link below to share it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <Input
            value={`${window.location.protocol}//${window.location.host}/${shareableLink}`}
            readOnly
          />
          <CopyLink
            text={`${window.location.protocol}//${window.location.host}/${shareableLink}`}
          />
        </div>
        {/* <div className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div> */}
        {/* <Button variant="outline" className="mt-4" onClick={() => setCreatedPage(null)}>
      Create Another Page
    </Button> */}
      </DialogContent>
    </Dialog>
  );
};

// --- CreateFeedbackPage Component ---
export default function CreateFeedbackPage() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [pendingData, setPendingData] = useState<z.infer<
    typeof createFeedbackPageSchema
  > | null>(null); // Store form data before submission
  const [shareableLink, setShareableLink] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resetFiles, setResetFiles] = useState(false);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<z.infer<typeof createFeedbackPageSchema>>({
    resolver: zodResolver(createFeedbackPageSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      files: [],
      customQuestions: []
    },
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customQuestions"
  });

  const addQuestion = (type: "text" | "rating") => {
    append({
      id: nanoid(),
      question: "",
      type
    });
  };

  const handleFormSubmit = async (
    data: z.infer<typeof createFeedbackPageSchema>
  ) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.link) formData.append("link", data.link);
      formData.append("customQuestions", JSON.stringify(data.customQuestions));

      // Append multiple files
      if (data.files && data.files.length > 0) {
        data.files.slice(0, 5).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axios.post("/api/feedbacks/page", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        }
      });

      const responseData = response.data;
      if (responseData.success) {
        toast({
          title: "Feedback Page Created",
          description: "Your feedback page has been successfully created.",
          variant: "default"
        });
        form.reset();
        setResetFiles((prev) => !prev); // Toggle reset state to trigger file reset

        setShareableLink(responseData.shareableLink);
        // TODO : update link with env.
        setShowSuccessModal(true);
        // Optionally, you could redirect after closing the modal: TODO
        // router.push(responseData.shareableLink);
      }
    } catch (error) {
      console.error("Error in Creating Feedback Page:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: "Submission Failed",
        description: errorMessage || "Failed to create feedback page",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof createFeedbackPageSchema>) => {
    if (!data.link && (!data.files || data.files.length === 0)) {
      setPendingData(data);
      setShowWarning(true);
    } else {
      handleFormSubmit(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Create Feedback Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Input */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter feedback title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Link Input */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Link</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="text-gray-500 w-5 h-5" />
                        <Input
                          placeholder="Paste a relevant URL (optional)"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Uploader */}
              <FormField
                control={form.control}
                name="files"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <FormControl>
                      <FileUploader
                        onFilesChange={(files) => {
                          onChange(files);
                        }}
                        resetTrigger={resetFiles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Questions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Custom Questions</h2>
                {fields.map((q, index) => (
                  <div key={q.id} className="border p-4 rounded space-y-2">
                    <FormField
                      control={form.control}
                      name={`customQuestions.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {`${q.type === "text" ? "Text" : "Rating"} Question`}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your question"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Add Question Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addQuestion("text")}
                  >
                    Add Text Question
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addQuestion("rating")}
                  >
                    Add Rating
                  </Button>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Uploading: {uploadProgress}%
                  </span>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              {/* Preview Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Page
              </Button>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Feedback Page"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview for Feedback Page */}
      {/* TODO: use anonymousComponent here? */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              🔍 Feedback Page Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            {!form.watch("title") &&
            !form.watch("description") &&
            (!form.watch("customQuestions") ||
              (form.watch("customQuestions") ?? []).length === 0) &&
            !form.watch("link") ? (
              <p className="text-gray-500 dark:text-gray-300">
                No preview available. Please fill in some details to see a
                preview.
              </p>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {form.watch("title") || "Untitled Page"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {form.watch("description") || "No description provided."}
                </p>

                {(form.watch("customQuestions") ?? []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Custom Questions:
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {(form.watch("customQuestions") ?? []).map((q, i) => (
                        <li key={i}>{q.question || "Unnamed Question"}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {form.watch("link") && (
                  <a
                    href={form.watch("link")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 dark:text-blue-400 underline mt-2 inline-block"
                  >
                    {form.watch("link")}
                  </a>
                )}
              </>
            )}
          </div>
          <Button onClick={() => setShowPreview(false)} className="mt-4">
            <EyeClosed className="w-4 h-4 mr-2" />
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proceed Without Files or Link?</AlertDialogTitle>
            <AlertDialogDescription>
              You haven&apos;t added any files or a link. Are you sure you want
              to submit without them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowWarning(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleFormSubmit(pendingData!)}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shareable Link Modal */}
      <ShareableLinkModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        shareableLink={shareableLink}
        toast={toast}
      />
    </div>
  );
}
