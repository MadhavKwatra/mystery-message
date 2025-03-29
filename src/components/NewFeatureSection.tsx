"use client";

import { CheckCircle, MoveRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const feedbackTypes = [
  {
    title: "Team Retrospective",
    questions: [
      "What went well this sprint?",
      "What could be improved?",
      "Rate team communication (1-5):"
    ],
    answers: [
      "The collaboration between design and development teams was exceptional.",
      "We need more clarity on requirements before starting development.",
      4
    ]
  },
  {
    title: "Personal Development",
    questions: [
      "What areas have you improved in most?",
      "What skills would you like to develop next?",
      "Rate your work-life balance (1-5):"
    ],
    answers: [
      "I've significantly improved my presentation skills and technical documentation.",
      "I'd like to focus on developing my leadership and mentoring abilities.",
      3
    ]
  },
  {
    title: "Product Feedback",
    questions: [
      "What feature do you find most useful?",
      "What feature would you like to see added?",
      "Rate the product usability (1-5):"
    ],
    answers: [
      "The dashboard analytics and real-time notifications are incredibly useful.",
      "I'd love to see integration with our project management tools.",
      5
    ]
  },
  {
    title: "Event Evaluation",
    questions: [
      "What did you enjoy most about the event?",
      "How could we improve future events?",
      "Rate the overall experience (1-5):"
    ],
    answers: [
      "The networking opportunities and quality of speakers were outstanding.",
      "Consider adding more interactive workshops and breakout sessions.",
      4
    ]
  },
  {
    title: "Course Feedback",
    questions: [
      "What topics were most valuable?",
      "What additional content would you like to see?",
      "Rate the instructor effectiveness (1-5):"
    ],
    answers: [
      "The practical examples and real-world applications were incredibly helpful.",
      "More advanced topics and case studies would enhance the learning experience.",
      5
    ]
  }
];

export const NewFeatureSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side: Feature description */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl"></div>
              <div className="relative">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm mb-4 font-semibold">
                  NEW FEATURE
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
                  Receive Anonymous Feedback
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Collect honest, unbiased feedback from your team, audience, or
                  customers. Our structured feedback system helps you gather
                  insights that drive meaningful improvements.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Customizable feedback forms",
                    "Multiple question types and rating scales",
                    "Response tracking and analytics",
                    "100% anonymous for honest responses"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold">
                    Explore Feedback Feature{" "}
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right side: Feedback carousel */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-100 dark:bg-pink-900/30 rounded-full blur-xl"></div>

              <Carousel className="w-full max-w-sm md:max-w-md mx-auto">
                <CarouselContent>
                  {feedbackTypes.map((feedback, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4 dark:text-white">
                              {feedback.title} Feedback
                            </h3>
                            <div className="space-y-5">
                              {feedback.questions.map((question, qIndex) => (
                                <div key={qIndex}>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {question}
                                  </label>

                                  {qIndex === 2 ? (
                                    // Rating stars
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((rating) => (
                                        <Star
                                          key={rating}
                                          className={cn(
                                            "h-8 w-8 transition-colors",
                                            rating <= feedback.answers[2]
                                              ? "fill-yellow-500 text-yellow-500"
                                              : "text-gray-300 dark:text-gray-600"
                                          )}
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    // Text feedback
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                                      <p className="text-gray-600 dark:text-gray-400 italic">
                                        {feedback.answers[qIndex]}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Anonymous • 2 days ago
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="static transform-none mx-2" />
                  <CarouselNext className="static transform-none mx-2" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
