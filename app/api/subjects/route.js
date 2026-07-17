import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const subjects = await Subject.find().select("-__v").sort({ year: 1, name: 1 }).lean();

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

export async function PUT(req) {
  try {
    await database();
    const body = await req.json();
    const { id, name, code, description, year, department } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Subject ID is required" },
        { status: 400 }
      );
    }

    if (!name || !code || !year || !department) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if new code already exists (and it's not the same subject)
    const existingSubject = await Subject.findOne({ code, _id: { $ne: id } });
    if (existingSubject) {
      return NextResponse.json(
        { message: "Subject code already exists" },
        { status: 409 }
      );
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        code,
        description,
        year,
        department,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedSubject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subject updated successfully", data: updatedSubject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { message: "Error updating subject", error: error.message },
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
        { message: "Subject ID is required" },
        { status: 400 }
      );
    }

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subject deleted successfully", data: deletedSubject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { message: "Error deleting subject", error: error.message },
      { status: 500 }
    );
  }
}
