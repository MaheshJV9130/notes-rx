import { NextResponse } from "next/server";
import { uploadToB2, getB2PublicUrl } from "@/utils/b2Client";
import { extractFirstPageThumbnail } from "@/utils/pdfThumbnail";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(bytes);

    // Generate unique filenames
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const pdfFileName = `pdf/${timestamp}_${randomString}_${file.name}`;
    const thumbnailFileName = `thumbnails/${timestamp}_${randomString}_thumbnail.png`;

    console.log("[v0] Uploading PDF to B2:", pdfFileName);

    // Upload PDF to B2
    const pdfUploadResponse = await uploadToB2(pdfFileName, pdfBuffer, "application/pdf");
    const pdfUrl = getB2PublicUrl(pdfFileName);

    console.log("[v0] PDF uploaded successfully. URL:", pdfUrl);

    // Extract and upload thumbnail
    let thumbnailUrl = null;
    let b2ThumbnailId = null;

    try {
      console.log("[v0] Extracting thumbnail...");
      const thumbnailBuffer = await extractFirstPageThumbnail(pdfBuffer);
      
      console.log("[v0] Uploading thumbnail to B2:", thumbnailFileName);
      const thumbnailUploadResponse = await uploadToB2(
        thumbnailFileName,
        thumbnailBuffer,
        "image/png"
      );
      
      thumbnailUrl = getB2PublicUrl(thumbnailFileName);
      b2ThumbnailId = thumbnailUploadResponse.fileId;
      console.log("[v0] Thumbnail uploaded successfully. URL:", thumbnailUrl);
    } catch (thumbError) {
      console.warn("[v0] Thumbnail extraction failed, continuing without thumbnail:", thumbError.message);
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        filename: pdfFileName,
        size: file.size,
        type: file.type,
        originalName: file.name,
        pdfUrl: pdfUrl,
        thumbnailUrl: thumbnailUrl,
        b2FileId: pdfUploadResponse.fileId,
        b2ThumbnailId: b2ThumbnailId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file", error: error.message },
      { status: 500 }
    );
  }
}
