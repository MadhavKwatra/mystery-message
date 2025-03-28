import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/model/Notification";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET all Notifications
export async function GET(req: NextRequest) {
  await dbConnect();

  // Get current logged-in user
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Convert to ObjectId
  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const notifications = await NotificationModel.find({
      userId,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Notifications fetched successfully",
        notificationData: notifications
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications", error);
    return NextResponse.json(
      { success: false, message: "Error fetching notifications" },
      { status: 500 }
    );
  }
}

// POST Create Notification
// DO I NEED IT?
// export async function POST(req: NextRequest) {
//   await dbConnect();

//   // Get current logged-in user
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   try {
//     const body = await req.json();
//     const { message, type, redirectTo } = body;

//     // Create notification
//     const notification = await NotificationModel.create({
//       userId: session.user._id,
//       message,
//       type,
//       redirectTo,
//       viewed: false
//     });

//     // Trigger Pusher event
//     await pusher.trigger(
//       `user-${session.user._id}-notifications`,
//       "new-notification",
//       {
//         id: notification._id,
//         message: notification.message,
//         type: notification.type,
//         createdAt: notification.createdAt
//       }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Notification created successfully",
//         notification
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating notification", error);
//     return NextResponse.json(
//       { success: false, message: "Error creating notification" },
//       { status: 500 }
//     );
//   }
// }

// Mark notifcations as Viewd
export async function PATCH(req: NextRequest) {
  await dbConnect();

  // Get current logged-in user
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { notificationIds } = body;

    // Validate that these notifications belong to the current user
    const result = await NotificationModel.updateMany(
      {
        _id: { $in: notificationIds },
        userId: session.user._id
      },
      { viewed: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notifications marked as read",
        updatedCount: result.modifiedCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read", error);
    return NextResponse.json(
      { success: false, message: "Error marking notifications as read" },
      { status: 500 }
    );
  }
}

// Delete Notifications
export async function DELETE(req: NextRequest) {
  await dbConnect();

  // Get current logged-in user
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { notificationIds } = body;

    // Delete specific notifications belonging to the user
    const result = await NotificationModel.updateMany(
      {
        _id: { $in: notificationIds },
        userId: session.user._id
      },
      {
        isDeleted: true
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notifications deleted successfully",
        deletedCount: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notifications", error);
    return NextResponse.json(
      { success: false, message: "Error deleting notifications" },
      { status: 500 }
    );
  }
}

// Delete all notifications
export async function PUT(req: NextRequest) {
  await dbConnect();

  // Get current logged-in user
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Remove all notifications for the user
    const result = await NotificationModel.updateMany(
      {
        userId: session.user._id
      },
      { isDeleted: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "All notifications cleared successfully",
        deletedCount: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing all notifications", error);
    return NextResponse.json(
      { success: false, message: "Error clearing notifications" },
      { status: 500 }
    );
  }
}
