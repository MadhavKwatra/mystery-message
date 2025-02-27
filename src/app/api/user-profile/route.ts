import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import UserModel from "@/model/User";

export async function PUT(req: NextRequest) {
  await dbConnect();

  // get current logged in user
  const session = await getServerSession(authOptions);

  //   asserting
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const { username } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
      _id: { $ne: userId }
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists. Choose another one."
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.username === username) {
      return Response.json(
        {
          success: false,
          message: "Username is the same as the current one. No changes made.",
          username
        },
        { status: 200 }
      );
    }
    user.username = username;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User details updated successfully",
        username
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user details", error);
    return Response.json(
      { success: false, message: "Error updating user details" },
      { status: 500 }
    );
  }
}
