import database from "@/utils/database";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");

    const filter = {};
    if (year) filter.year = parseInt(year);
    if (subject) filter.subject = subject;
    if (chapter) filter.chapter = chapter;

    const notes = await Note.find(filter)
      .populate("subject", "name code")
      .populate("chapter", "chapterNumber title")
      .populate("uploadedBy", "name email")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!notes || notes.length === 0) {
      return NextResponse.json(
        { message: "No notes found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Error fetching notes", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { title, description, subject, chapter, year, pdfFileName, pdfSize, uploadedBy } = body;

    if (!title || !subject || !chapter || !year || !pdfFileName || !uploadedBy) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newNote = new Note({
      title,
      description,
      subject,
      chapter,
      year,
      pdfFileName,
      pdfSize,
      uploadedBy,
    });

    const savedNote = await newNote.save();
    const populatedNote = await Note.findById(savedNote._id)
      .populate("subject", "name code")
      .populate("chapter", "chapterNumber title")
      .populate("uploadedBy", "name email");

    return NextResponse.json(
      { message: "Note created successfully", data: populatedNote },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { message: "Error creating note", error: error.message },
      { status: 500 }
    );
  }
}
