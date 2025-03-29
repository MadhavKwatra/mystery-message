"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartColumn,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MessageCircleQuestion,
  ShieldCheck,
  Twitter,
  Users2,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_NAME } from "@/config/config";
import { faqItems } from "@/lib/faqs";
import { NewFeatureSection } from "@/components/NewFeatureSection";
import { HowItWorksSection } from "@/components/HowItWorks";
import { HeroSection } from "@/components/HeroSection";

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    feedback:
      "The anonymous messaging feature is brilliant. It allows me to communicate openly without any hesitation!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    feedback:
      "This platform makes anonymous conversations seamless. It's been a great way to foster honest dialogue in my team.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    name: "Sarah Lee",
    role: "Content Writer",
    feedback:
      "I appreciate the simplicity and privacy it offers. The anonymity allows everyone to express their opinions freely.",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    name: "Vikram Ayer",
    role: "Graphic Designer",
    feedback:
      "Using this platform for anonymous brainstorming sessions has been a game-changer for our creative team.",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    name: "Emma Carter",
    role: "HR Manager",
    feedback:
      "Anonymity has never been this easy to maintain. It's helped us uncover honest feedback and improve team morale effortlessly.",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg"
  },
  {
    name: "Ryan Evans",
    role: "Team Lead",
    feedback:
      "The platform's anonymous messaging feature has completely changed how we communicate during retrospectives. It’s amazing for fostering transparency.",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg"
  },
  {
    name: "Alice Johnson",
    role: "UX Designer",
    feedback:
      "The user experience is flawless. I especially love how it encourages open and honest discussions anonymously.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    name: "Arjun Patel",
    role: "Marketing Specialist",
    feedback:
      "The anonymous messaging tool has been an incredible way to gather insights and ideas from my colleagues without bias.",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg"
  }
];

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <NewFeatureSection />
      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Other Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Anonymous Messaging */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Anonymous Messaging
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Send private messages without revealing your identity.
                    Perfect for honest communication.
                  </p>
                </div>
              </div>
            </div>

            {/* Anonymous Feedback */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                  <MessageCircleQuestion className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Anonymous Feedback
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Collect honest feedback from team members, friends, or
                    audience without bias.
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                  <ChartColumn className="w-8 h-8 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Insightful Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track message trends, engagement patterns, and feedback
                    themes through intuitive visualizations.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mr-4">
                  <ShieldCheck className="w-8 h-8 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Privacy & Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your data is encrypted and protected. We prioritize user
                    privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow h-full dark:bg-gray-900 ${index % 2 == 0 ? `hidden sm:block` : ""} border border-gray-200 dark:border-gray-700`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="border-2 border-purple-200 dark:border-purple-900">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {testimonial.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg dark:text-white">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 relative pl-4">
                    {testimonial.feedback}
                    <span className="absolute left-1 top-0 text-sm text-purple-500">
                      &quot;
                    </span>
                    <span className="text-sm text-purple-500"> &quot;</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to embrace honest communication?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who&apos;ve discovered the power of
            anonymous messaging and feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button className="text-lg px-8 py-6 bg-white text-purple-700 hover:bg-gray-100 hover:scale-105 transition-all">
                Get Started Free
              </Button>
            </Link>
            <Link href="/features">
              <Button
                variant="outline"
                className="text-lg px-8 py-6 border-white dark:text-white hover:bg-white/10 hover:scale-105 transition-all text-black"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-2xl mx-auto"
          >
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left hover:no-underline dark:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Enhanced footer with links and newsletter */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">{APP_NAME}</h3>
              <p className="text-gray-400 mb-4">
                Share your thoughts freely and securely with anyone, anywhere.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Anonymous Messages
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Feedback System
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
