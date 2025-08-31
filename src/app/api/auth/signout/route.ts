import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ success: true, message: "Signed out successfully" });

    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, 
    });

    res.cookies.set("userType", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, 
    });

    return res;
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
