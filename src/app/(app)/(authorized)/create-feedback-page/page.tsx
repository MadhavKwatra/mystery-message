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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { createFeedbackPageSchema } from "@/schemas/createFeedbackPageSchema";

export default function CreateFeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof createFeedbackPageSchema>>({
    resolver: zodResolver(createFeedbackPageSchema),
    defaultValues: {
      title: "",
      description: "",
      file: null,
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
    const isValid = await form.trigger(); // Manually trigger validation
    if (!isValid) return; // Stop if validation fails

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                }
              }}
              className="space-y-4"
            >
              {/* Title */}
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
                      <Textarea
                        placeholder="Enter details (Rich Text Editor Coming Soon)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload */}
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0])}
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
                    {/* Question Input */}
                    <FormField
                      control={form.control}
                      name={`customQuestions.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
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

                    <Button variant="destructive" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Add Question Buttons */}
                <div className="flex gap-2">
                  <Button type="button" onClick={() => addQuestion("text")}>
                    Add Text Question
                  </Button>
                  <Button type="button" onClick={() => addQuestion("rating")}>
                    Add Rating
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
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
