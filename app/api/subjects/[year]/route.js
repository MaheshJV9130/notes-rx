import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { year } = await params;

    // Check if it's a MongoDB ObjectId (24 hex characters) - individual subject
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(year);

    if (isMongoId) {
      // Fetch individual subject by ID
      const subject = await Subject.findById(year).select("-__v");

      if (!subject) {
        return NextResponse.json(
          { message: "Subject not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(subject, { status: 200 });
    }

    // Otherwise treat it as year filter
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

export async function PUT(req, { params }) {
  try {
    await database();
    const { year: id } = await params;
    const body = await req.json();

    const { name, code, description, year, department } = body;

    if (!name || !code || !year || !department) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

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

export async function DELETE(req, { params }) {
  try {
    await database();
    const { year: id } = await params;

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
