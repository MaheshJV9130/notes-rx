import database from "@/utils/database";
import Subject from "@/model/Subject";
import Chapter from "@/model/Chapter";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { ids, resourceType } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Please provide an array of IDs to delete" },
        { status: 400 }
      );
    }

    if (!resourceType) {
      return NextResponse.json(
        { message: "Resource type is required (subjects, chapters, or notes)" },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    let model;

    switch (resourceType.toLowerCase()) {
      case "subjects":
        model = Subject;
        break;
      case "chapters":
        model = Chapter;
        break;
      case "notes":
        model = Note;
        break;
      default:
        return NextResponse.json(
          { message: "Invalid resource type" },
          { status: 400 }
        );
    }

    const result = await model.deleteMany({ _id: { $in: ids } });
    deletedCount = result.deletedCount;

    return NextResponse.json(
      {
        message: `Successfully deleted ${deletedCount} ${resourceType}`,
        data: { deletedCount },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { message: "Error in bulk delete", error: error.message },
      { status: 500 }
    );
  }
}
