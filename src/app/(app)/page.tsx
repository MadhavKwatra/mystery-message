// Landing page at /
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import { Mail, MoveRight, Share, User } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
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
const faqItems = [
  {
    question: "What is this platform?",
    answer:
      "This is an anonymous message platform where users can create a link to receive anonymous messages or feedback from anywhere in the world."
  },
  {
    question: "How does it work?",
    answer:
      "Create an account, share your unique link, and start receiving anonymous messages from others."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, the platform is completely free to use."
  },
  {
    question: "How do I send anonymous messages?",
    answer:
      "Use the unique link of the person you want to message, type your message, and send it anonymously."
  },
  {
    question: "How do I create an account?",
    answer:
      "Simply sign up with your email/username and password. Or you can choose other ways like Google ,Instagram etc. "
  },
  {
    question: "Why am I not receiving messages?",
    answer:
      "Ensure that you are accepting messages and that you've shared your unique link correctly. If the issue persists, raise a bug."
  }
];

const steps = [
  {
    icon: <User className="w-8 h-8 text-blue-500 dark:text-blue-300" />,
    title: "Create Your Account",
    description: "Sign up with email/username, or using your socials."
  },
  {
    icon: <Share className="w-8 h-8 text-green-500 dark:text-green-300" />,
    title: "Share Your Link",
    description: "Share your unique link with others on social media."
  },
  {
    icon: <Mail className="w-8 h-8 text-purple-500 dark:text-purple-300" />,
    title: "Receive Anonymous Messages",
    description: "Messages are delivered to your inbox."
  }
];

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
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 dark:bg-gray-800 bg-gray-50 ">
        <section className="text-center mb-8 md:mb-12  max-w-3xl ">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            {"Dive into the World of "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Anonymous Messages
            </span>
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg dark:text-gray-200 text-gray-700 mb-8">
            Share your thoughts freely and securely with anyone, anywhere.
          </p>
          <Link href={"/sign-up"}>
            <Button className="text-xl my-10 p-6 font-semibold transition-colors bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 dark:text-white">
              Get started <MoveRight />
            </Button>
          </Link>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl "
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4 ">
                <Card className="rounded-3xl dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 ">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      {/* How It Works */}
      <section className=" bg-gray-50 dark:bg-gray-800 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 ">
          How it works!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto container px-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow basis-full h-54 border rounded-3xl dark:bg-gray-900"
            >
              <CardHeader>
                <div className="flex items-center justify-center">
                  <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900">
                    {step.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl mb-2 dark:text-white">
                  {index + 1}. {step.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
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
                className={`hover:shadow-lg transition-shadow h-full dark:bg-gray-900 ${index % 2 == 0 ? `hidden sm:block` : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
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
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonial.feedback}
                  </p>
                </CardContent>
              </Card>
            ))}
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
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © {currentYear} {APP_NAME}. All rights reserved.
      </footer>
    </>
  );
}
