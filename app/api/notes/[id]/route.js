import database from "@/utils/database";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const note = await Note.findById(id)
      .populate("subject", "name code")
      .populate("chapter", "chapterNumber title")
      .populate("uploadedBy", "name email")
      .select("-__v");

    if (!note) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { message: "Error fetching note", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await database();
    const { id } = await params;
    const body = await req.json();

    const { title, description, subject, chapter, year, pdfFileName, pdfSize } = body;

    if (!title || !subject || !chapter || !year) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description,
      subject,
      chapter,
      year,
      updatedAt: new Date(),
    };

    // Only update PDF filename if a new one is provided
    if (pdfFileName) {
      updateData.pdfFileName = pdfFileName;
    }
    if (pdfSize) {
      updateData.pdfSize = pdfSize;
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("subject", "name code")
      .populate("chapter", "chapterNumber title")
      .populate("uploadedBy", "name email");

    if (!updatedNote) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Note updated successfully", data: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { message: "Error updating note", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Note deleted successfully", data: deletedNote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { message: "Error deleting note", error: error.message },
      { status: 500 }
    );
  }
}
