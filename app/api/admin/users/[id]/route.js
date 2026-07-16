import database from "@/utils/database";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const user = await AdminUser.findById(id).select("-password -__v");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin user:", error);
    return NextResponse.json(
      { message: "Error fetching admin user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await database();
    const { id } = await params;
    const body = await req.json();

    const { name, email, password, role, department, isActive } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if new email already exists (for a different user)
    const existingUser = await AdminUser.findOne({
      email: email.toLowerCase(),
      _id: { $ne: id },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use by another user" },
        { status: 409 }
      );
    }

    const updateData = {
      name,
      email: email.toLowerCase(),
      role: role || "admin",
      department: department || "",
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (password && password.trim()) {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      updateData.password = hashedPassword;
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password -__v");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Admin user updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { message: "Error updating admin user", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = await params;

    const deletedUser = await AdminUser.findByIdAndDelete(id).select(
      "-password"
    );

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Admin user deleted successfully", data: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { message: "Error deleting admin user", error: error.message },
      { status: 500 }
    );
  }
}
