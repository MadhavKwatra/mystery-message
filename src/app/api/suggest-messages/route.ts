import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export async function POST(req: Request) {
  try {
    const prompt =
      "Generate three engaging, open-ended questions as a single string, with each question separated by '||'. These questions will be used on an anonymous social messaging platform (e.g., Qooh.me, ngl.link) and should appeal to a broad audience. Avoid personal or sensitive topics—focus instead on fun, thought-provoking, and universally relatable themes that spark curiosity and encourage conversation.Make sure each response is unique and different from previous requests. Inject a playful, creative, or unexpected element into at least one of the questions. The structure should follow this example\:'If you could swap lives with a fictional character for a week, who would it be and why?||What’s the weirdest but most useful advice you’ve ever received?||If animals could talk, which one do you think would be the funniest conversationalist?'Encourage a mix of creativity, humor, and curiosity while keeping the questions fresh, exciting, and easy to engage with.";

    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      prompt,
      maxTokens: 400,
      temperature: 1.0,
      seed: Math.floor(Math.random() * 1000),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("An unexpected error occurred", error);
    // throw error;
    return Response.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
