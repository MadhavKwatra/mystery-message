"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const [isDarkMode, setIsDarkMode] = useState(() => false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check localStorage for saved preference
  useEffect(() => {
    const savedDarkMode = window.localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
  }, []);
  // Add or remove the `dark` class from the <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        <div className="flex gap-5">
          {session ? (
            <>
              <span className="mr-4">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          )}
          <Button
            onClick={toggleDarkMode}
            className=" rounded-full transition-colors bg-slate-100 group"
            size={"icon"}
            variant={"outline"}
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-800 fill-current group-hover:text-accent-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-gray-800 fill-current" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
