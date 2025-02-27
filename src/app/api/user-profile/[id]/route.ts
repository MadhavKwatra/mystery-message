import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  await dbConnect();

  if (!id) {
    return Response.json(
      { success: false, message: "ID missing" },
      { status: 400 }
    );
  }
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User details fetched successfully",
        details: {
          avatar_url: user.avatar_url,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user details", error);
    return Response.json(
      { success: false, message: "Error fetching user details" },
      { status: 500 }
    );
  }
}
