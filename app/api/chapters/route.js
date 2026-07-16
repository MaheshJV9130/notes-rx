import database from "@/utils/database";
import Chapter from "@/model/Chapter";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    if (!subject) {
      return NextResponse.json(
        { message: "Subject ID is required" },
        { status: 400 }
      );
    }

    const chapters = await Chapter.find({ subject })
      .populate("subject", "name code")
      .select("-__v")
      .sort({ chapterNumber: 1 });

    if (!chapters || chapters.length === 0) {
      return NextResponse.json(
        { message: "No chapters found for this subject", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: chapters }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { message: "Error fetching chapters", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { chapterNumber, title, description, subject } = body;

    if (!chapterNumber || !title || !subject) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newChapter = new Chapter({
      chapterNumber,
      title,
      description,
      subject,
    });

    const savedChapter = await newChapter.save();
    const populatedChapter = await Chapter.findById(savedChapter._id).populate(
      "subject",
      "name code"
    );

    return NextResponse.json(
      { message: "Chapter created successfully", data: populatedChapter },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { message: "Error creating chapter", error: error.message },
      { status: 500 }
    );
  }
}
