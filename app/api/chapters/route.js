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

export async function PUT(req) {
  try {
    await database();
    const body = await req.json();
    const { id, chapterNumber, title, description, subject } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Chapter ID is required" },
        { status: 400 }
      );
    }

    if (!chapterNumber || !title || !subject) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      id,
      {
        chapterNumber,
        title,
        description,
        subject,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("subject", "name code");

    if (!updatedChapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Chapter updated successfully", data: updatedChapter },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { message: "Error updating chapter", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Chapter ID is required" },
        { status: 400 }
      );
    }

    const deletedChapter = await Chapter.findByIdAndDelete(id);

    if (!deletedChapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Chapter deleted successfully", data: deletedChapter },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json(
      { message: "Error deleting chapter", error: error.message },
      { status: 500 }
    );
  }
}
