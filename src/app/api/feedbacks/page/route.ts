import { cloudinary } from "@/cloudinary/config";
import dbConnect from "@/lib/dbConnect";
import FeedbackPage from "@/model/FeedbackPage";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { User } from "@/model/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: User = session?.user as User;

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }
    const formData = await req.formData();
    console.log("Request hit ", formData);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const customQuestions = JSON.parse(
      (formData.get("customQuestions") as string) || "[]"
    );
    const files = formData.getAll("files") as File[];

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "application/pdf"
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB max size
    const maxFiles = 5;

    if (files.length > maxFiles) {
      return NextResponse.json(
        { success: false, message: `Maximum ${maxFiles} files allowed.` },
        { status: 400 }
      );
    }

    // Generate a unique slug
    const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;

    // Process file uploads concurrently
    const uploadPromises = files.map(async (file) => {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, JPG, PNG, GIF, and PDF are allowed."
        );
      }
      if (file.size > maxSize) {
        throw new Error(
          `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const sanitizeFilename = (name: string) =>
        name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
      const removeExtension = (filename: string) =>
        filename.split(".").slice(0, -1).join(".");
      const uploadOptions: UploadApiOptions = {
        folder: `spill-it-uploads/${user._id}/feedbacks/${slug}`,
        resource_type: file.type === "application/pdf" ? "raw" : "image",
        public_id: `${nanoid(5)}_${sanitizeFilename(removeExtension(file.name))}`, // Ensures unique filenames
        format: file.type === "application/pdf" ? "pdf" : undefined // Force PDF format
      };

      console.log(file, "uploadOptions 96");
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    });

    // Execute all uploads in parallel
    let fileUrls: string[] = [];
    try {
      fileUrls = await Promise.all(uploadPromises);
      console.log("INSIDE 108", fileUrls);
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: "File upload failed." },
        { status: 500 }
      );
    }

    const newFeedbackPage = new FeedbackPage({
      createdBy: session.user._id,
      title,
      description,
      slug,
      customQuestions,
      files: fileUrls
    });
    const feedbackPage = await newFeedbackPage.save();
    console.log("Feedback page created:", feedbackPage);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback page created successfully",
        feedbackPage,
        shareableLink: `feedbacks/${slug}`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create feedback page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create feedback page" },
      { status: 500 }
    );
  }
}
