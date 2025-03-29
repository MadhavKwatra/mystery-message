"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  Mic,
  ImageIcon,
  Lightbulb,
  Paperclip,
  ChevronDown,
  Sparkles,
  BotMessageSquare,
  SendHorizonal,
  VenetianMask
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/config/config";
import { useCompletion } from "ai/react";

// Message schema for validation
const MessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  sender: z.enum(["user", "bot"]),
  timestamp: z.date().default(() => new Date())
});

type Message = z.infer<typeof MessageSchema>;

// Example questions
const exampleQuestions = [
  "What can you help me with?",
  "How does this work?",
  "Tell me a fun fact"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {
    isLoading: isAiAnswering,
    error,
    complete,
    completion
  } = useCompletion({
    api: "/api/chatbot"
  });

  useEffect(() => {
    if (completion) {
      setIsLoading(false);

      setMessages((prev) => {
        if (prev.length > 0 && isAiAnswering) {
          // Update the last bot message during streaming
          return prev.map((msg, index) =>
            index === prev.length - 1 && msg.sender === "bot"
              ? { ...msg, content: completion }
              : msg
          );
        } else {
          // Add a new bot message when a fresh response starts
          return [
            ...prev,
            { content: completion, sender: "bot", timestamp: new Date() }
          ];
        }
      });
    }
  }, [completion, isAiAnswering]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input
      const validatedContent = MessageSchema.parse({
        content: input,
        sender: "user"
      });

      // Add user message
      setMessages((prev) => [...prev, validatedContent]);
      setInput("");
      setIsLoading(true);
      complete(validatedContent.content);
      console.log(validatedContent, "validatedContent");
      // Send user message to chatbot API
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
      }
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
    // Submit the form programmatically
    const form = document.getElementById("chatForm") as HTMLFormElement;
    form.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-black shadow-lg"
            initial={{ width: 56, height: 56, borderRadius: 28 }}
            animate={{
              width: 350,
              height: 450,
              borderRadius: 12,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            exit={{
              width: 56,
              height: 56,
              borderRadius: 28,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            style={{
              boxShadow:
                "0 0 25px rgba(255, 255, 255, 0.15), 0 0 10px rgba(0, 0, 0, 0.5)"
            }}
          >
            {isOpen && (
              <motion.div
                className="flex h-full flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: {
                    enter: { duration: 0.2, delay: 0.2 },
                    exit: { duration: 0.2 }
                  }
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-2 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black">
                      <VenetianMask className="h-10 w-10 text-[#a855f7]" />
                    </div>
                    <span className="text-lg font-bold text-white">
                      {APP_NAME}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md p-3 text-gray-400 hover:bg-gray-800 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <ChevronDown className="h-7 w-7" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "flex",
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2",
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-white"
                          )}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex max-w-[80%] items-center gap-1 rounded-lg bg-gray-800 px-4 py-3 text-white">
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                              delay: 0
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                              delay: 0.2
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                              delay: 0.4
                            }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {messages.length === 0 && !isLoading && (
                      <div className="flex flex-col gap-2">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-center text-gray-400"
                        >
                          <p className="text-lg font-medium">
                            👋 Hey there! Welcome to{" "}
                            <span className="font-bold text-white">
                              {APP_NAME}
                            </span>
                            .
                          </p>
                          <p className="mt-1">
                            You can ask me anything about the platform like
                          </p>
                        </motion.div>

                        {exampleQuestions.map((question, index) => (
                          <motion.button
                            key={index}
                            className="rounded-lg border border-gray-700 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                            onClick={() => handleExampleClick(question)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    {error && (
                      <p className="text-red-500">
                        Oops! Something went wrong. Please try again.
                      </p>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-gray-800 p-4">
                  <form
                    id="chatForm"
                    onSubmit={handleSubmit}
                    className="relative"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-800">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything"
                        className="min-h-[60px] w-full resize-none bg-gray-800 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      {/* TODO: ADd more functionality Maybe */}
                      {/* <div className="absolute bottom-2 left-2 flex gap-2">
                        <button
                          type="button"
                          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Mic className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Lightbulb className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Paperclip className="h-5 w-5" />
                        </button>
                      </div> */}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          type="submit"
                          className="rounded-full bg-gray-600 p-1.5 text-white hover:bg-gray-500"
                        >
                          <SendHorizonal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            {!isOpen && (
              <motion.div
                className="flex h-full w-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow:
                "0 0 25px rgba(255, 255, 255, 0.15), 0 0 10px rgba(0, 0, 0, 0.5)"
            }}
          >
            <div className="relative flex h-10 w-10 items-center justify-center">
              <BotMessageSquare className="h-6 w-6 text-white" />
              <motion.span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
