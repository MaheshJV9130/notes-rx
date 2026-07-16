import database from "@/utils/database";
import Subject from "@/model/Subject";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const subject = await Subject.findById(id).select("-__v");

    if (!subject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject, { status: 200 });
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { message: "Error fetching subject", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await database();
    const { id } = await params;
    const body = await req.json();

    const { name, code, description, year, department } = body;

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

export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = await params;

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
