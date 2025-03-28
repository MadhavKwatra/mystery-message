"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  Loader2,
  MessageCircle,
  Trash2
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/model/Notification";

interface NotificationsDropdownProps {
  userId: string;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const {
    notifications,
    isLoading,
    markNotificationsAsRead,
    deleteNotifications,
    clearAllNotifications
  } = useNotifications(userId);
  const router = useRouter();

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.viewed).length;

  // Handle individual notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markNotificationsAsRead([notification._id.toString()]);

    // Redirect if there's a redirect path
    if (notification.redirectTo) {
      router.push(notification.redirectTo);
    }
  };

  // Render notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "anonymous-message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "anonymous-feedback":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-10 h-10" />
          {unreadCount > 0 && !isLoading && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          {isLoading && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1.5 py-0.5"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[500px] overflow-y-auto"
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications ({unreadCount} unread)</span>

          {notifications.length > 0 && (
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    markNotificationsAsRead(
                      notifications
                        .filter((n) => !n.viewed)
                        .map((n) => n._id.toString())
                    )
                  }
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAllNotifications}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isLoading ? (
          <DropdownMenuItem disabled>
            <div className="w-full text-center">Loading notifications...</div>
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            <div className="w-full text-center text-gray-500">
              No notifications
            </div>
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id.toString()}
              className={`
                flex items-start space-x-3 cursor-pointer my-2 
                ${!notification.viewed ? "bg-blue-100 dark:bg-gray-800" : ""}
              `}
              onSelect={() => handleNotificationClick(notification)}
            >
              {/* Notification Icon */}
              <div className="pt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{notification.message}</p>
                  {!notification.viewed && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true
                  })}
                </p>
              </div>

              {/* Delete Individual Notification */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotifications([notification._id.toString()]);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
