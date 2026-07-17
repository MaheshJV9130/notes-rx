import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
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
    const pdfFileName = `${timestamp}_${randomString}_${file.name}`;

    // Check if B2 is configured
    const hasB2Config = process.env.B2_APPLICATION_KEY_ID && 
                       process.env.B2_APPLICATION_KEY && 
                       process.env.B2_BUCKET_ID &&
                       process.env.B2_BUCKET_NAME;

    let pdfUrl, thumbnailUrl, b2FileId, b2ThumbnailId;

    if (hasB2Config) {
      console.log("[v0] B2 configured - uploading to cloud:", pdfFileName);
      try {
        // Upload PDF to B2
        const pdfUploadResponse = await uploadToB2(pdfFileName, pdfBuffer, "application/pdf");
        pdfUrl = getB2PublicUrl(pdfFileName);
        b2FileId = pdfUploadResponse.fileId;
        console.log("[v0] PDF uploaded to B2:", pdfUrl);

        // Extract and upload thumbnail
        try {
          const thumbnailFileName = `${timestamp}_${randomString}_thumbnail.png`;
          const thumbnailBuffer = await extractFirstPageThumbnail(pdfBuffer);
          const thumbnailUploadResponse = await uploadToB2(
            thumbnailFileName,
            thumbnailBuffer,
            "image/png"
          );
          thumbnailUrl = getB2PublicUrl(thumbnailFileName);
          b2ThumbnailId = thumbnailUploadResponse.fileId;
          console.log("[v0] Thumbnail uploaded to B2:", thumbnailUrl);
        } catch (thumbError) {
          console.warn("[v0] Thumbnail extraction failed:", thumbError.message);
        }
      } catch (b2Error) {
        console.error("[v0] B2 upload failed:", b2Error.message);
        throw new Error(`B2 upload failed: ${b2Error.message}`);
      }
    } else {
      // Fallback to local storage
      console.log("[v0] B2 not configured - saving locally:", pdfFileName);
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filepath = join(uploadDir, pdfFileName);
      await writeFile(filepath, pdfBuffer);
      
      pdfUrl = `/uploads/${pdfFileName}`;
      console.log("[v0] PDF saved locally:", pdfUrl);

      // Generate local thumbnail
      try {
        const thumbnailFileName = `${timestamp}_${randomString}_thumbnail.png`;
        const thumbnailBuffer = await extractFirstPageThumbnail(pdfBuffer);
        const thumbnailPath = join(uploadDir, thumbnailFileName);
        await writeFile(thumbnailPath, thumbnailBuffer);
        thumbnailUrl = `/uploads/${thumbnailFileName}`;
        console.log("[v0] Thumbnail saved locally:", thumbnailUrl);
      } catch (thumbError) {
        console.warn("[v0] Thumbnail extraction failed:", thumbError.message);
      }
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
        b2FileId: b2FileId,
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
