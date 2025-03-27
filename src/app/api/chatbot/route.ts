import { faqItems } from "@/lib/faqs";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt: message } = await req.json();
    // const body = await req.json();
    // console.log(body, " i nchatbot")
    // const { message } = body;

    // Validate message input
    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Invalid message input" },
        { status: 400 }
      );
    }

    console.log(message, req.json(), "HE YDLFLSDFJ");
    // Check if the message matches a FAQ question
    const faqMatch = faqItems.find((faq) =>
      message.toLowerCase().includes(faq.question.toLowerCase())
    );

    if (faqMatch) {
      return Response.json({ success: true, response: faqMatch.answer });
    }

    const prompt = `You are a chatbot for an anonymous messaging platform. Answer user queries conversationally and provide helpful responses. If a user asks about the platform, use the following FAQs for reference:
    ${faqItems.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n")}
    If the question is unrelated, respond in a friendly and engaging way.`;

    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `${prompt}\nUser: ${message}\nChatbot:`,
      maxTokens: 400,
      temperature: 0.7,
      seed: Math.floor(Math.random() * 1000)
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("An unexpected error occurred in chatbot api", error);
    return Response.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
