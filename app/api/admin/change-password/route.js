import database from "@/utils/database";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { userId, currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await AdminUser.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const hashedCurrentPassword = crypto
      .createHash("sha256")
      .update(currentPassword)
      .digest("hex");

    if (user.password !== hashedCurrentPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Error changing password", error: error.message },
      { status: 500 }
    );
  }
}
