import database from "@/utils/database";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Simple hash function (for production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { name, email, password, department } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create new admin user
    const newAdmin = new AdminUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      department: department || "",
      role: "admin",
    });

    await newAdmin.save();

    // Don't return password
    const adminData = newAdmin.toObject();
    delete adminData.password;

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        data: adminData,
      },
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
