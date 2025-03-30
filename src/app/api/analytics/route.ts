import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import FeedbackPage from "@/model/FeedbackPage";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();
  try {
    // Total Users Joined
    const totalUsers = await UserModel.countDocuments({});

    // Total Anonymous Messages:
    const totalMessagesAgg = await UserModel.aggregate([
      {
        $project: { messagesCount: { $size: { $ifNull: ["$messages", []] } } }
      },
      { $group: { _id: null, totalMessages: { $sum: "$messagesCount" } } }
    ]);
    const totalMessages = totalMessagesAgg[0]?.totalMessages || 0;

    // Total Anonymous Feedbacks:
    const totalFeedbacksAgg = await FeedbackPage.aggregate([
      {
        $project: {
          feedbackCount: { $size: { $ifNull: ["$feedbacks", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: "$feedbackCount" }
        }
      }
    ]);
    const totalFeedbacks = totalFeedbacksAgg[0]?.totalFeedbacks || 0;

    return NextResponse.json(
      {
        success: true,
        analyticsData: {
          totalUsers,
          totalMessages,
          totalFeedbacks
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching analytics" },
      { status: 500 }
    );
  }
}
