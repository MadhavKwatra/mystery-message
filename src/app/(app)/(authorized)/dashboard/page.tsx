"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { getSocket } from "@/config/socket";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import CopyLink from "@/components/CopyLink";
import { pusherClient } from "@/lib/pusher/client";
function DashboardPage() {
  // const socket = useMemo(() => {
  //   const socket = getSocket();
  //   if (!socket?.connected) return socket.connect();

  //   return socket;
  // }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();

  // Handling socket initiliazation and connection
  // useEffect(() => {
  //   console.log("useeffect dashboard called", session);
  //   if (!session || !session.user) return;

  //   const joinRoom = () => {
  //     console.log("Emitting joinRoom for:", session.user.username);
  //     socket.emit("joinRoom", session.user.username);
  //   };
  //   const handleConnect = () => {
  //     console.log("Connected to Socket.io server", "Dashboard");
  //     joinRoom();
  //   };

  //   // If already connected, join immediately.
  //   if (socket.connected) {
  //     console.log("already connected to room");
  //     joinRoom();
  //   } else {
  //     console.log("not connected to room");
  //     socket.on("connect", handleConnect);
  //   }

  //   const handleNewMessage = (newMessageDetails: { message: Message }) => {
  //     console.log(
  //       "New message received:",
  //       newMessageDetails,
  //       "DashBoard",
  //       newMessageDetails.message._id
  //     );
  //     const { message } = newMessageDetails;
  //     // Important: Update messages state in a way that triggers a re-render.
  //     setMessages((prevMessages) => [message, ...prevMessages]);
  //     // You can show toast notifications here if you want
  //     toast({
  //       title: "Someone sent a message!"
  //     });
  //   };

  //   const handleDisconnect = () => {
  //     console.log("Disconnected from Socket.io server", "Dashboard");
  //   };
  //   socket.on("disconnect", handleDisconnect);
  //   socket.on("newMessage", handleNewMessage);

  //   socket.on("reconnect", (attempt) => {
  //     console.log(`Reconnected to server, attempt #${attempt}`);
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     if (socket) {
  //       socket.off("connect");
  //       socket.off("newMessage");
  //       socket.off("disconnect");
  //       socket.disconnect();
  //     }
  //   };
  // }, [session, toast, socket]);
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      console.error("Error in fetching accept messages", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Failed to fetch message settings",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages"
          });
        }
      } catch (error) {
        console.error("Error in fetching messages", error);

        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        if (axiosError.response?.status === 404) {
          setMessages([]);
          return;
        }
        toast({
          title: "Error",
          description: errorMessage || "Failed to fetch messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    const fetchData = async () => {
      await fetchMessages();
      await fetchAcceptMessage();
      setIsPageLoading(false);
    };
    fetchData();

    console.log("📡 Subscribing to:", `private-user-${session.user._id}`);
    const channel = pusherClient.subscribe(`private-user-${session.user._id}`);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Subscription succeeded!");
    });

    channel.bind("pusher:subscription_error", (err: Error) => {
      console.error("❌ Subscription error:", err);
    });
    channel.bind("new-message", (newMessage: Message) => {
      setMessages((prev) => [newMessage, ...prev]); // Add new message
      console.log("💬 New Message Received:", newMessage);

      toast({
        title: "New message received!",
        description: "You have a new message from an anonymous user.",
        duration: 2000,
        variant: "default"
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session, setValue, fetchAcceptMessage, fetchMessages, toast]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages", !acceptMessages);

      toast({
        title: response.data.message,
        variant: "default"
      });
    } catch (error) {
      console.error("Error in switching accept messages", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Failed to switch accept messages",
        variant: "destructive"
      });
    }
  };

  if (isPageLoading) {
    return (
      <>
        <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>
        <Skeleton className="w-[200px] h-[25px] rounded-md mb-2" />
        {/* Skeleton for input + button */}
        <div className="flex items-center mb-4 space-x-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>

        {/* Skeleton for switch */}
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Separator />
        <Skeleton className="w-[50px] h-[50px] rounded-md mt-4" />
        {/* Skeleton for messages */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      </>
    );
  }
  if (!session || !session.user) {
    return (
      <div className="text-center text-lg font-medium mt-10">Please login</div>
    );
  }

  const { username } = session.user;

  // TODO: do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full rounded-md p-2 mr-2"
          />
          <CopyLink text={profileUrl} />
        </div>
      </div>

      <div className="mb-4 items-center flex">
        <Switch
          className=" dark:bg-gray-700 "
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 dark:bg-gray-900"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center p-6">
            <p className="text-2xl font-semibold">📭 Your inbox is empty!</p>
            <p className="text-lg mt-2">
              🔗Share your link to start receiving anonymous messages.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
export default DashboardPage;
