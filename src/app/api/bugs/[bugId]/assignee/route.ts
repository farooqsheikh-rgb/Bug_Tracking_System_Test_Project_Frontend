import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bugId: string }> }
) {
  try {
    const { bugId } = await params;
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await axios.post(
      `http://localhost:8000/api/v1/bugs/${bugId}/assignee`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error assigning bug to developer:", error);
    
    let errorMessage = "Failed to assign bug to developer";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
