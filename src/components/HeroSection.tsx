"use client";

import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"messages" | "feedback">(
    "messages"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab((prev) => (prev === "messages" ? "feedback" : "messages"));
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeTab]); // Reset timer whenever tab changes

  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-24 py-16 dark:bg-gray-800 bg-gray-50">
      <div className="text-center mb-2 md:mb-4 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          {"Dive into the World of "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Anonymous Messages
          </span>
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg dark:text-gray-200 text-gray-700 ">
          Share your thoughts freely and securely with anyone, anywhere.
        </p>
        <Link href={"/sign-up"}>
          <Button className="text-xl mt-4 p-6 font-semibold transition-transform bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 dark:text-white">
            Get started <MoveRight className="ml-2" />
          </Button>
        </Link>
      </div>

      {/* Feature Showcase with Tabs */}
      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="messages" value={activeTab} className="w-full">
          <TabsContent value="messages" className="space-y-4">
            <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-full -mt-10 -mr-10 opacity-50"></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-3 text-purple-700 dark:text-purple-300">
                    Express Freely
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Send anonymous messages to friends, colleagues, or anyone
                    with a unique link.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      100% Anonymous
                    </li>
                    <li className="flex items-center">
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Easy Sharing
                    </li>
                    <li className="flex items-center">
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Real-time Notifications
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-3">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 transform rotate-1 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border-l-4 border-purple-500">
                        <p className="text-gray-700 dark:text-gray-300">
                          I really enjoyed your presentation yesterday. Your
                          ideas are innovative!
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Received: 2 hours ago
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border-l-4 border-pink-500">
                        <p className="text-gray-700 dark:text-gray-300">
                          Your artwork is amazing! Have you considered
                          submitting it to the gallery?
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Received: Yesterday
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700 rounded-full -mt-10 -mr-10 opacity-50"></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-300">
                    Gather Honest Feedback
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Create custom feedback forms and get anonymous insights from
                    your audience.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Customizable Questions
                    </li>
                    <li className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Star Ratings
                    </li>
                    <li className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Detailed Analytics
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-3">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 transform -rotate-1 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">
                          How would you rate your experience?
                        </p>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-6 w-6 ${star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">
                          What could we improve?
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                            &quot;The dashboard could have more visual analytics
                            to track my messages.&quot;
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Additional comments:
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                            &quot;Overall an excellent platform. The anonymity
                            makes communication much more genuine!&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsList className="grid w-full grid-cols-2 my-4">
            <TabsTrigger
              value="messages"
              className="text-lg py-3"
              onClick={() => {
                setActiveTab("messages");
              }}
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="text-lg py-3"
              onClick={() => {
                setActiveTab("feedback");
              }}
            >
              Feedback
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
};
