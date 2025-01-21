import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { decode } from "punycode";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();

    // You know this, to decode speacial symbols from urls
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verification successful",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: !isCodeValid
            ? "Incorrect verification code."
            : "The verification code is expired. Please sign up again.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying User",
      },
      { status: 500 }
    );
  }
}
