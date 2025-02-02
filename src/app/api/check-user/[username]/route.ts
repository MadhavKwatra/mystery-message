import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function GET(
  req: Request,
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

    //TODO: Do some Link Analytics stuff

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
