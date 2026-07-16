import database from "@/utils/database";
import AdminUser from "@/model/AdminUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req) {
  try {
    await database();
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password);

    if (admin.password !== hashedPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { message: "Your account has been deactivated" },
        { status: 403 }
      );
    }

    // Create a simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString("hex");

    // Return user data without password
    const adminData = admin.toObject();
    delete adminData.password;

    const response = NextResponse.json(
      {
        message: "Login successful",
        data: {
          ...adminData,
          token,
        },
      },
      { status: 200 }
    );

    // Set secure cookie with token
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Error during login", error: error.message },
      { status: 500 }
    );
  }
}
