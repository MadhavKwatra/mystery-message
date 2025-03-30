import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { NextApiResponse } from "next";
import { getSocketServer } from "../../../../socketProvider";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HttpServer & { io?: IOServer };
  };
};

export async function POST(req: Request, res: NextApiResponseWithSocket) {
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

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    const updatedNewMessage = user.messages[user.messages.length - 1];
    const io = getSocketServer(); // Get the Socket.io server instance
    io.to(user.username).emit("newMessage", {
      username: user.username,
      message: updatedNewMessage.toObject()
    });
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
