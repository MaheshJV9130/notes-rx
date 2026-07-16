import database from "@/utils/database";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req) {
  try {
    await database();

    const users = await AdminUser.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "No admin users found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "Error fetching admin users", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { name, email, password, role, department } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const newUser = new AdminUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "admin",
      department: department || "",
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { message: "Admin user created successfully", data: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { message: "Error creating admin user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await database();
    const body = await req.json();

    const { id, name, email, role, department, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

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

export async function DELETE(req) {
  try {
    await database();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

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
