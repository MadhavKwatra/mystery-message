"use client";

import { useState, useEffect } from "react";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";

export const HeroSection2 = () => {
  const [activeTab, setActiveTab] = useState<"messages" | "feedback">(
    "messages"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "messages" ? "feedback" : "messages"));
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-24 py-16 dark:bg-gray-800 bg-gray-50">
      <div className="text-center mb-6 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Dive into the World of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Anonymous Messages
          </span>
        </h1>
        <p className="text-base md:text-lg dark:text-gray-200 text-gray-700">
          Share your thoughts freely and securely with anyone, anywhere.
        </p>
      </div>

      {/* Responsive Tabs */}
      <div className="w-full max-w-4xl mx-auto">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="flex justify-center gap-2 md:gap-4 mb-6">
            <TabsTrigger
              value="messages"
              className={`text-lg py-3 w-1/2 md:w-auto ${
                activeTab === "messages" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className={`text-lg py-3 w-1/2 md:w-auto ${
                activeTab === "feedback" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("feedback")}
            >
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            {/* Messages Content */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                Express Freely
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Send anonymous messages to friends, colleagues, or anyone with a
                unique link.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            {/* Feedback Content */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                Gather Honest Feedback
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Create custom feedback forms and get anonymous insights from
                your audience.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Link href="/sign-up">
        <Button className="text-xl my-4 p-6 font-semibold transition-transform bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 dark:text-white">
          Get started <MoveRight className="ml-2" />
        </Button>
      </Link>
    </section>
  );
};
