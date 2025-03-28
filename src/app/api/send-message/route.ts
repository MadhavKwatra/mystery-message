import dbConnect from "@/lib/dbConnect";
import { getPusherInstance } from "@/lib/pusher/server";
import NotificationModel from "@/model/Notification";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import mongoose from "mongoose";
const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Is user accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      content,
      createdAt: new Date()
    };
    user.messages.push(newMessage as Message);
    await user.save();
    // Trigger Pusher event to user who receives anonymous message
    await pusherServer.trigger(
      `private-user-${user._id}`,
      "new-message",
      newMessage
    );

    // Create notification
    const notification = await NotificationModel.create({
      userId: user._id,
      message: "Someone sent an Anonymous Message",
      type: "anonymous-message",
      redirectTo: "/dashboard",
      viewed: false
    });

    // Trigger Pusher event
    await pusherServer.trigger(
      `private-user-${user._id}-notifications`,
      "new-notification",
      notification
    );
    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}
