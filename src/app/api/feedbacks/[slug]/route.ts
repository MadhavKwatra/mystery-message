import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FeedbackPage from "@/model/FeedbackPage";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const feedback = await FeedbackPage.findOne({ slug: params.slug });
    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Feedback Page Fetched Successfully",
        feedbackData: feedback
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
