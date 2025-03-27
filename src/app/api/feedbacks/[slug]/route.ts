import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FeedbackPage from "@/model/FeedbackPage";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const isAnonymousSender = !session || !session.user;

    const feedback = await FeedbackPage.findOne({ slug: params.slug }).lean();
    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    // Return different fields based on user type
    const feedbackData = isAnonymousSender
      ? {
          ...feedback,
          feedbacks: []
        }
      : feedback;

    return NextResponse.json(
      {
        success: true,
        message: "Feedback Page Fetched Successfully",
        feedbackData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feedback page" },
      { status: 500 }
    );
  }
}
