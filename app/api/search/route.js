import database from "@/utils/database";
import Subject from "@/model/Subject";
import Chapter from "@/model/Chapter";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type"); // "subjects", "chapters", "notes", or empty for all

    if (!query || query.length < 2) {
      return NextResponse.json(
        { message: "Search query must be at least 2 characters", data: {} },
        { status: 400 }
      );
    }

    const results = {};

    // Search subjects
    if (!type || type === "subjects") {
      results.subjects = await Subject.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { code: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .select("-__v")
        .limit(10);
    }

    // Search chapters
    if (!type || type === "chapters") {
      results.chapters = await Chapter.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .populate("subject", "name code")
        .select("-__v")
        .limit(10);
    }

    // Search notes
    if (!type || type === "notes") {
      results.notes = await Note.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .populate("subject", "name")
        .populate("chapter", "title chapterNumber")
        .select("-__v")
        .limit(10);
    }

    return NextResponse.json(
      { message: "Search completed", data: results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { message: "Error searching", error: error.message },
      { status: 500 }
    );
  }
}
