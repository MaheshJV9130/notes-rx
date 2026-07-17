import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(req, { params }) {
  try {
    const { filename } = await params;

    // Security: Prevent directory traversal attacks
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json(
        { message: "Invalid filename" },
        { status: 400 }
      );
    }

    const filepath = join(process.cwd(), "public", "uploads", filename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { message: "PDF not found" },
        { status: 404 }
      );
    }

    // Read file and get stats
    const fileBuffer = await readFile(filepath);
    const fileStats = await stat(filepath);

    // Return PDF as blob with proper headers
    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set("Content-Length", fileStats.size);
    response.headers.set("Cache-Control", "public, max-age=3600");
    response.headers.set("Content-Disposition", "inline"); // Display inline, not download

    return response;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json(
      { message: "Error fetching PDF", error: error.message },
      { status: 500 }
    );
  }
}
