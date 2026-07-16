import database from "@/utils/database";
import Chapter from "@/model/Chapter";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const chapter = await Chapter.findById(id)
      .populate("subject", "name code")
      .select("-__v");

    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { message: "Error fetching chapter", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await database();
    const { id } = await params;
    const body = await req.json();

    const { chapterNumber, title, description, subject } = body;

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

export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = await params;

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
