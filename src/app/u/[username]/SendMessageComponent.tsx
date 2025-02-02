"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCompletion } from "ai/react";
const initialSuggestedMessages: string[] = [
  "Every mystery begins with a question. Here’s one: Who sent this?",

  "Imagine receiving a message from a stranger… oh wait, you just did.",

  "What’s the one thing you’d change about your life right now if no one could judge?",
];

const SuggestedMessages: React.FC<{
  onClickMessage: (message: string) => void;
}> = ({ onClickMessage }) => {
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    initialSuggestedMessages
  );

  // This helps in the streaming response of the suggest-messages api
  const {
    isLoading: isSuggestLoading,
    error,
    complete,
    completion,
  } = useCompletion({
    api: "/api/suggest-messages",
  });

  // This looks cool instead of instant rendering of suggested messages
  useEffect(() => {
    if (completion) {
      setSuggestedMessages(parseStringMessages(completion));
    }
  }, [completion]);
  return (
    <div className="space-y-4 my-8">
      <Card>
        <CardHeader className="text-center">
          <h3 className="text-xl font-semibold">
            Here are some sample messages you can send:
          </h3>
          <p>Click on any message below to select it.</p>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {error ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            suggestedMessages.map((message, index) => (
              <Button
              className="whitespace-normal break-words px-4 py-2 leading-normal h-auto"
                key={index}
                variant="outline"
                onClick={() => onClickMessage(message)}
              >
                {message}
              </Button>
            ))
          )}

          {isSuggestLoading ? (
            <Button className="my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </Button>
          ) : (
            <Button
              onClick={() => complete("")}
              className="my-4"
              disabled={isSuggestLoading}
            >
              Suggest Messages with AI
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Parse || string from API
const parseStringMessages = (stringMessage: string): string[] => {
  return stringMessage.split("||");
};

function SendMessage({
  isAcceptingMessages = true,
}: {
  isAcceptingMessages: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const { username } = params;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const messageContent = form.watch("content");

  const { toast } = useToast();

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.content,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset();
    } catch (error) {
      console.error("Error in sending message", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Sending message failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // User is not accepting messages
  if (!isAcceptingMessages) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Unfortunately, @{username} is not accepting messages right now.
        </h1>
        <p className="text-lg text-gray-700">You can try again later.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xl">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <SuggestedMessages onClickMessage={handleMessageClick} />
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
export default SendMessage;
