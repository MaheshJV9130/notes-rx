import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { year } = params;

    // Validate and parse year
    const parsedYear = parseInt(year, 10);
    
    if (isNaN(parsedYear) || parsedYear < 1 || parsedYear > 4) {
      return NextResponse.json(
        { message: "Invalid year. Please provide a year between 1 and 4", data: [] },
        { status: 400 }
      );
    }

    const subjects = await Subject.find({ year: parsedYear }).select("-__v");

    return NextResponse.json(subjects || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { message: "Error fetching subjects", data: [], error: error.message },
      { status: 500 }
    );
  }
}
