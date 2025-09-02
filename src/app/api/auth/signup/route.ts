import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await axios.post("http://localhost:8000/api/v1/auth/signup", body, {
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

    if (accessToken) {
      res.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
      });
    }

    return res;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          error?: string;
        };
        status?: number;
      };
    };

    return NextResponse.json(
      {
        success: false,
        error: err.response?.data?.error || "Signup failed",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
