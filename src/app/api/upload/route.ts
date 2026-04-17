import { NextRequest, NextResponse } from "next/server";
import { uploadToDrive } from "@/lib/gdrive";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: "No file provided" } },
        { status: 400 }
      );
    }

    // Convert bits of file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Google Drive
    const imageUrl = await uploadToDrive(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
      },
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to upload file" } },
      { status: 500 }
    );
  }
}
