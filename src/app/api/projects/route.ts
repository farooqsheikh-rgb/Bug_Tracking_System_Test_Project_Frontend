import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const response = await axios.get("http://localhost:8000/api/v1/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.error || "Failed to fetch projects",
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const response = await axios.post("http://localhost:8000/api/v1/projects", body, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const data = response.data;

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: "Creating Project failed" },
        { status: 400 }
      );
    }

    const projectData = data.data;
    const accessToken = projectData.accessToken;

    const res = NextResponse.json({ success: true, project: projectData });

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
