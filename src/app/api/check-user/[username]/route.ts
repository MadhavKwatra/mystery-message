import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  const { username } = params;
  const decodedUsername = decodeURIComponent(username);

  await dbConnect();

  try {
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User exists",
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user", error);
    return Response.json(
      { success: false, message: "Error checking user" },
      { status: 500 }
    );
  }
}
