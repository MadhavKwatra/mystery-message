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
import { Loader2, Link as LinkIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function CreateFeedbackPage() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createFeedbackPageSchema>>({
    resolver: zodResolver(createFeedbackPageSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      files: [],
      customQuestions: []
    }
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

  const onSubmit = async (data: z.infer<typeof createFeedbackPageSchema>) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Feedback Created",
        description: "Your feedback page has been successfully created.",
        variant: "default"
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while creating the feedback page.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Feedback Request"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
