import dbConnect from "@/lib/dbConnect";
import FeedbackPage, { Answer } from "@/model/FeedbackPage";

export async function POST(req: Request) {
  await dbConnect();
  const { slug, answers, comment } = await req.json();

  if (!slug || !comment) {
    return Response.json(
      { success: false, message: "Slug and comment are required" },
      { status: 400 }
    );
  }
  try {
    const feedbackPage = await FeedbackPage.findOne({ slug });
    if (!feedbackPage) {
      return Response.json(
        { success: false, message: "Feedback page not found" },
        { status: 404 }
      );
    }

    // Validate answers against custom questions
    const validAnswers = answers.every((answer: Answer) =>
      feedbackPage.customQuestions.some(
        (q) => q.id === answer.questionId && q.type === answer.type
      )
    );

    if (!validAnswers) {
      return Response.json(
        { success: false, message: "Invalid answers provided" },
        { status: 400 }
      );
    }

    // Create new feedback entry
    const newFeedback = {
      answers,
      comment,
      createdAt: new Date()
    };

    feedbackPage.feedbacks.push(newFeedback);
    await feedbackPage.save();

    return Response.json(
      { success: true, message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting feedback", error);
    return Response.json(
      { success: false, message: "Error submitting feedback" },
      { status: 500 }
    );
  }
}
