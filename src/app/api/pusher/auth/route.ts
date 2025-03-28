import dbConnect from "@/lib/dbConnect";
import { getPusherInstance } from "@/lib/pusher/server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

const pusherServer = getPusherInstance();

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // get current logged in user
    const session = await getServerSession(authOptions);

    console.log("🔍 Pusher Auth Request:", { session });
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const socketId = formData.get("socket_id") as string;
    const channelName = formData.get("channel_name") as string;

    // Validate required parameters
    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Missing socketId or channelName" },
        { status: 400 }
      );
    }

    // Ensure user can only subscribe to their own channel
    if (!channelName.includes(`private-user-${session.user._id}`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    console.log("✅ Authenticated:", authResponse);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Authorization Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
