import dbConnect from "@/lib/dbConnect";
import FeedbackPage from "@/model/FeedbackPage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user._id;

    // Fetch all feedback pages created by the user
    const feedbackPages = await FeedbackPage.find({ createdBy: userId }).sort({
      createdAt: -1
    });

    return NextResponse.json(
      {
        success: true,
        feedbacksData: feedbackPages,
        message: "Feedback pages fetched successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch feedback pages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feedback pages" },
      { status: 500 }
    );
  }
}
