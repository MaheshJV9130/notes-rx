import database from "@/utils/database";
import Subject from "@/model/Subject";
import Chapter from "@/model/Chapter";
import Note from "@/model/Note";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await database();

    // Get counts for all resources
    const [
      totalSubjects,
      totalChapters,
      totalNotes,
      totalAdmins,
      notesThisMonth,
      totalViews,
    ] = await Promise.all([
      Subject.countDocuments(),
      Chapter.countDocuments(),
      Note.countDocuments(),
      AdminUser.countDocuments(),
      Note.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Note.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]),
    ]);

    // Get subjects by year distribution
    const subjectsByYear = await Subject.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Get top uploaded subjects
    const topSubjects = await Note.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },
      {
        $project: {
          subjectName: "$subject.name",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get recent notes
    const recentNotes = await Note.find()
      .populate("subject", "name")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title subject uploadedBy createdAt views");

    const statistics = {
      overview: {
        totalSubjects,
        totalChapters,
        totalNotes,
        totalAdmins,
        notesThisMonth,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      subjectsByYear,
      topSubjects,
      recentNotes,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { message: "Error fetching statistics", error: error.message },
      { status: 500 }
    );
  }
}
