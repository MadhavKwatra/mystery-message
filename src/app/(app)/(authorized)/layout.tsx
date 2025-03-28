"use client";

import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { useNotifications } from "@/hooks/useNotifications";
import {
  LayoutDashboard,
  Settings,
  ChartColumn,
  MessageCircleQuestion
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
export default function AuthorizedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { notifications } = useNotifications(session?.user._id as string);
  let isNewMessage = false;
  let isNewFeedback = false;
  if (notifications && notifications.length > 0) {
    isNewMessage =
      notifications.findIndex(
        (notification) =>
          notification.viewed === false &&
          notification.type === "anonymous-message"
      ) !== -1;
    isNewFeedback =
      notifications.findIndex(
        (notification) =>
          notification.viewed === false &&
          notification.type === "anonymous-feedback"
      ) !== -1;
  }
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem
          handleClick={() => {
            router.push("/dashboard");
          }}
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={pathname === "/dashboard"}
          alert={isNewMessage}
        />
        <SidebarItem
          handleClick={() => {
            router.push("/dashboard/analytics");
          }}
          icon={<ChartColumn size={20} />}
          text="Analytics"
          active={pathname === "/dashboard/analytics"}
        />
        <SidebarItem
          handleClick={() => {
            router.push("/feedbacks");
          }}
          icon={<MessageCircleQuestion size={20} />}
          alert={isNewFeedback}
          text="Feedbacks"
          active={pathname === "/feedbacks"}
        />
        <hr className="my-3" />
        <SidebarItem
          handleClick={() => {
            router.push("/profile/settings");
          }}
          active={pathname === "/profile/settings"}
          icon={<Settings size={20} />}
          text="Settings"
        />
      </Sidebar>
      <div className="my-8 md:px-16 lg:mx-auto p-6 rounded-xl max-w-6xl w-full">
        {children}
      </div>
    </div>
  );
}
