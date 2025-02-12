import { cloudinary } from "@/cloudinary/config";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // get current logged in user
    const session = await getServerSession(authOptions);

    //   asserting
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Cloudinary credentials not found" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    // extract file
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]; // Add more if needed
    const maxSize = 5 * 1024 * 1024; // 5MB max size

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`,
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions: UploadApiOptions = {
      folder: `spill-it-uploads/${user._id}`,
      resource_type: "image",
      public_id: "avatar",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    };
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      uploadStream.end(buffer);
    });

    // Update in DB
    const updateResult = await UserModel.findByIdAndUpdate(
      user._id,
      { avatar_url: result.secure_url },
      { new: true, projection: { messages: 0 } },
    );
    // update in session too
    if (updateResult) {
      session.user.avatar_url = updateResult.avatar_url;
    }
    return NextResponse.json(
      {
        success: true,
        message: "Profile photo uploaded successfully",
        avatar_url: result.secure_url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to upload", error);

    return NextResponse.json(
      { success: false, message: "Failed to upload" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // get current logged in user
    const session = await getServerSession(authOptions);

    //   asserting
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Cloudinary credentials not found" },
        { status: 500 },
      );
    }
    const publicId = `spill-it-uploads/${user._id}/avatar`;

    const deletionResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
    });
    // Update in DB
    const updateResult = await UserModel.findByIdAndUpdate(
      user._id,
      { avatar_url: null },
      { new: true, lean: true, projection: { messages: 0 } },
    );
    if (updateResult) {
      session.user.avatar_url = updateResult.avatar_url;
    }
    return NextResponse.json(
      {
        success: true,
        message: "Profile photo removed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to remove profile photo", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove profile photo" },
      { status: 500 },
    );
  }
}
