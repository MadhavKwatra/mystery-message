"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, Share, Mail } from "lucide-react";

const steps = [
  {
    icon: <User className="w-10 h-10 text-blue-500 dark:text-blue-300" />,
    title: "Create Your Account",
    description:
      "Sign up with email/username, or using your socials in seconds."
  },
  {
    icon: <Share className="w-10 h-10 text-green-500 dark:text-green-300" />,
    title: "Share Your Link",
    description: "Share your unique link with others on social media platforms."
  },
  {
    icon: <Mail className="w-10 h-10 text-purple-500 dark:text-purple-300" />,
    title: "Receive Anonymous Messages",
    description: "Messages are delivered to your inbox privately and securely."
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl opacity-60"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-60"></div>

        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            <span className="relative inline-block">
              How It Works
              <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform translate-y-2"></span>
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16 text-lg">
            Get started with anonymous messaging in {steps.length} simple steps
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <Card className="relative w-full h-full border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20"></div>

                  <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full blur-md"></div>
                      <div className="relative flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-md">
                        {step.icon}
                        <span
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
