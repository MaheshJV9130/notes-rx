import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const subjects = await Subject.find().select("-__v").sort({ year: 1, name: 1 });

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { message: "No subjects found", data: [] },
        { status: 200 }
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

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { name, code, description, year, department } = body;

    if (!name || !code || !year || !department) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return NextResponse.json(
        { message: "Subject code already exists" },
        { status: 409 }
      );
    }

    const newSubject = new Subject({
      name,
      code,
      description,
      year,
      department,
    });

    const savedSubject = await newSubject.save();

    return NextResponse.json(
      { message: "Subject created successfully", data: savedSubject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { message: "Error creating subject", error: error.message },
      { status: 500 }
    );
  }
}
