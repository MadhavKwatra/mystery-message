// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { pusherClient } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";
import { ApiResponse } from "@/types/ApiResponse";
import { Notification } from "@/model/Notification";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(userId, "from useNotifications");
      const response = await axios.get<ApiResponse>("/api/notifications");

      setNotifications(response?.data?.notificationData || []);
      setIsLoading(false);
    } catch (err) {
      console.log("Failed to fetch Notifications", err);
      setError("Failed to fetch notifications");
      setIsLoading(false);
    }
  }, [userId]);

  // Mark notifications as read
  const markNotificationsAsRead = async (notificationIds: string[]) => {
    try {
      await axios.patch("/api/notifications", { notificationIds });

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notificationIds.includes(notification._id.toString())
            ? { ...notification, viewed: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  // Delete specific notifications
  const deleteNotifications = async (notificationIds: string[]) => {
    try {
      await axios.delete("/api/notifications", {
        data: { notificationIds }
      });

      // Remove from local state
      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            !notificationIds.includes(notification._id.toString())
        )
      );
    } catch (err) {
      console.error("Failed to delete notifications", err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.put("/api/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    // Fetch initial notifications
    fetchNotifications();

    console.log(
      "📡 Subscribing to:",
      `private-user-${session.user._id}-notifications`
    );
    const channel = pusherClient.subscribe(
      `private-user-${session.user._id}-notifications`
    );

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Subscription succeeded!");
    });

    channel.bind("pusher:subscription_error", (err: Error) => {
      console.error("❌ Subscription error:", err);
    });
    channel.bind("new-notification", (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]); // Add new message
      console.log("💬 New notifcation Received:", newNotification);

      //TODO: Toast needed?
      // toast({
      //   title: "New message received!",
      //   description: "You have a new message from an anonymous user.",
      //   duration: 2000,
      //   variant: "default"
      // });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [fetchNotifications, session]);

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markNotificationsAsRead,
    deleteNotifications,
    clearAllNotifications
  };
}
