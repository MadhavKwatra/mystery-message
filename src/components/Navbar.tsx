"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Menu,
  X,
  Settings,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChartColumn,
  MessageCircleQuestion,
  VenetianMask
} from "lucide-react";
import { APP_NAME } from "@/config/config";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getOptimizedAvatarImageUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NotificationsDropdown } from "./NotificationDropdown";

function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { theme, setTheme } = useTheme();
  // Get the avatar URL from the session otherwise set to null
  let avatar_uri = session?.user.avatar_url || null;
  // optimize the image using cloudinary
  if (avatar_uri?.includes("https://res.cloudinary.com")) {
    avatar_uri = getOptimizedAvatarImageUrl(avatar_uri);
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Prevent background scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Button
          size={"icon"}
          variant={"outline"}
          className="md:hidden rounded-lg transition-colors bg-slate-100 group"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <X
              className="h-12 w-12  text-gray-800 group-hover:text-accent-foreground"
              strokeWidth={3}
            />
          ) : (
            <Menu
              className="h-12 w-12 text-gray-800 group-hover:text-accent-foreground"
              strokeWidth={3}
            />
          )}
        </Button>
        <Link
          href="/"
          className="text-xl font-bold md:mb-0 flex items-center gap-2"
        >
          <VenetianMask className="h-10 w-10 text-[#a855f7]" />
          {APP_NAME}
        </Link>
        {/* Notification icon on right side for mobile */}
        <div className="md:hidden">
          {session && user?._id && <NotificationsDropdown userId={user?._id} />}
        </div>
        <div className="hidden md:flex gap-5 items-center">
          {session ? (
            <>
              <span className="mr-4 font-bold">
                Welcome, {user?.username || user?.email}
              </span>
              {user?._id && <NotificationsDropdown userId={user?._id} />}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-10 h-10 border  border-gray-300 dark:border-gray-700">
                    {avatar_uri ? (
                      <>
                        <AvatarImage
                          src={avatar_uri}
                          className="object-cover"
                          alt="Profile Picture"
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <UserRound className="w-full h-full" />
                      </>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/profile/settings");
                    }}
                    className="cursor-pointer"
                  >
                    <Settings />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  >
                    {theme === "light" ? <Moon /> : <Sun />} Change Theme
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut /> <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant={"outline"}
                >
                  Login
                </Button>
              </Link>
              <Button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className=" rounded-full transition-colors bg-slate-100 group"
                size={"icon"}
                variant={"outline"}
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-800 fill-current group-hover:text-accent-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-800 fill-current group-hover:text-accent-foreground" />
                )}
              </Button>
            </>
          )}
        </div>
        {/* Button for mobile menu */}
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:-translate-x-full fixed inset-y-0 w-3/4 left-0 z-50 dark:bg-gray-900 bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700 text-center">
          {session ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border  border-gray-300 dark:border-gray-700">
                {avatar_uri ? (
                  <>
                    <AvatarImage
                      src={avatar_uri}
                      className="object-cover"
                      alt="Profile Picture"
                    />
                    <AvatarFallback>
                      {user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <UserRound className="w-full h-full" />
                  </>
                )}
              </Avatar>
              <span className="block text-gray-200 py-1 font-bold">
                Welcome, {user?.username || user?.email}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-200 ">Welcome</span>
          )}

          <div>
            <Button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setMobileMenuOpen(false);
              }}
              className=" rounded-full transition-colors bg-slate-100 group mr-2"
              size={"icon"}
              variant={"outline"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-800 fill-current group-hover:text-accent-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-gray-800 fill-current" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full transition-colors bg-slate-100 group"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Mobile Menu"
            >
              <X
                className="w-6 h-6 text-gray-800 group-hover:text-accent-foreground"
                strokeWidth={3}
              />
            </Button>
          </div>
        </div>
        {/* Menu Items */}
        <div className="px-4 py-3 space-y-1 flex flex-col gap-y-1">
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Button className="w-full font-semibold transition-colors group bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
                  <LayoutDashboard className="w-5 h-5 text-gray-800 group-hover:text-accent-foreground" />
                  Dashboard
                </Button>
              </Link>
              <Link
                href="/dashboard/analytics"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Button className="w-full font-semibold transition-colors group bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
                  <ChartColumn className="w-5 h-5 text-gray-800 group-hover:text-accent-foreground" />
                  Analytics
                </Button>
              </Link>
              <Link
                href="/feedbacks"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Button className="w-full font-semibold transition-colors group bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
                  <MessageCircleQuestion className="w-5 h-5 text-gray-800 group-hover:text-accent-foreground" />
                  Feedbacks
                </Button>
              </Link>
              <Link
                href="/profile/settings"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Button className="w-full font-semibold transition-colors group bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
                  <Settings className="w-5 h-5 text-gray-800 group-hover:text-accent-foreground" />{" "}
                  Profile Settings
                </Button>
              </Link>
              <Button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full font-semibold bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400 mt-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full font-semibold bg-slate-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-400 mt-2">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
