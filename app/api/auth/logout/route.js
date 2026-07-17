import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear the admin token cookie
    response.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediate expiry
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: "Error during logout", error: error.message },
      { status: 500 }
    );
  }
}
