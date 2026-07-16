import database from "@/utils/database";
import Subject from "@/model/Subject";
import Chapter from "@/model/Chapter";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const resourceType = searchParams.get("type") || "notes";
    const format = searchParams.get("format") || "json"; // json or csv

    let data = [];
    let filename = "";

    switch (resourceType.toLowerCase()) {
      case "subjects":
        data = await Subject.find()
          .select("-__v -password")
          .lean();
        filename = "subjects";
        break;
      case "chapters":
        data = await Chapter.find()
          .populate("subject", "name")
          .select("-__v")
          .lean();
        break;
      case "notes":
        data = await Note.find()
          .populate("subject", "name code")
          .populate("chapter", "chapterNumber title")
          .populate("uploadedBy", "name email")
          .select("-__v")
          .lean();
        filename = "notes";
        break;
      default:
        return NextResponse.json(
          { message: "Invalid resource type" },
          { status: 400 }
        );
    }

    if (format === "csv") {
      // Convert to CSV format
      const csv = convertToCSV(data, resourceType);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    } else {
      // Return as JSON
      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${filename}_${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { message: "Error exporting data", error: error.message },
      { status: 500 }
    );
  }
}

function convertToCSV(data, resourceType) {
  if (!data || data.length === 0) {
    return "No data available";
  }

  let headers = [];
  let rows = [];

  switch (resourceType.toLowerCase()) {
    case "subjects":
      headers = ["ID", "Name", "Code", "Year", "Department", "Description", "Created At"];
      rows = data.map((item) => [
        item._id,
        item.name,
        item.code,
        item.year,
        item.department,
        item.description,
        new Date(item.createdAt).toISOString(),
      ]);
      break;

    case "chapters":
      headers = ["ID", "Chapter Number", "Title", "Subject", "Description", "Created At"];
      rows = data.map((item) => [
        item._id,
        item.chapterNumber,
        item.title,
        item.subject?.name || "",
        item.description,
        new Date(item.createdAt).toISOString(),
      ]);
      break;

    case "notes":
      headers = [
        "ID",
        "Title",
        "Subject",
        "Chapter",
        "Year",
        "Views",
        "Uploaded By",
        "PDF Size (bytes)",
        "Created At",
      ];
      rows = data.map((item) => [
        item._id,
        item.title,
        item.subject?.name || "",
        item.chapter?.title || "",
        item.year,
        item.views,
        item.uploadedBy?.name || "",
        item.pdfSize,
        new Date(item.createdAt).toISOString(),
      ]);
      break;
  }

  // Escape CSV values
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build CSV
  const csvHeader = headers.map(escapeCSVValue).join(",");
  const csvRows = rows.map((row) => row.map(escapeCSVValue).join(",")).join("\n");

  return `${csvHeader}\n${csvRows}`;
}
