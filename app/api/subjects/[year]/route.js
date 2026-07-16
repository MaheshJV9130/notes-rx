import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { year } = params;

    const subjects = await Subject.find({ year: parseInt(year) }).select("-__v");

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { message: "No subjects found for this year" },
        { status: 404 }
      );
    }

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { message: "Error fetching subjects", error: error.message },
      { status: 500 }
    );
  }
}
