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
import { Loader2, Send } from "lucide-react";
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
    initialSuggestedMessages,
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

          <Button
            onClick={() => complete("")}
            className="my-4 font-semibold"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              "Suggest Messages with AI"
            )}
          </Button>
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

  // beaconAPI for analytics
  useEffect(() => {
    function trackVisit() {
      const data = JSON.stringify({
        userId: username,
      });
      // Send data to the analytics API without blocking page load
      navigator.sendBeacon("/api/track-visit", data);
    }
    trackVisit();
  }, [username]);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            User is not accepting messages right now.
          </h1>
          <p className="text-lg">
            Unfortunately, <strong>@{username}</strong> is not accepting
            messages right now. You can try again later.
          </p>
          <Link href="/">
            <Button className="mt-4">Go back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-auto p-3 md:p-6 bg-white rounded max-w-2xl pt-16 dark:bg-gray-900">
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
                    placeholder="Type your anonymous message here..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="font-bold w-full bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 py-5 dark:text-white"
            type="submit"
            disabled={isLoading || !messageContent}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Your message will be sent anonymously. Please be kind and respectful.
        </p>
      </Form>

      <SuggestedMessages onClickMessage={handleMessageClick} />
      <Separator className="my-6" />
      <div className="text-center">
        <Link href={"/sign-up"}>
          <Button
            className="font-bold py-4 px-8 md:py-6 md:px-10 md:text-lg"
            variant={"default"}
          >
            Get Your own Message Board
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default SendMessage;
