import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.post("http://localhost:8000/api/v1/auth/signin", body, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: "Signup failed" },
        { status: 400 }
      );
    }

    const userData = data.data;
    const accessToken = userData.accessToken;

    const res = NextResponse.json({ success: true, user: userData });

    // Set httpOnly cookie for access token
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Set non-httpOnly cookie for user type (accessible by frontend)
    res.cookies.set("userType", userData.user_type || userData.userType || "developer", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.error || "Invalid Email Or Password",
      },
      { status: error.response?.status || 500 }
    );
  }
}