import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const title = searchParams.get('title') || '';

    let backendUrl = `http://localhost:8000/api/v1/bugs/project/${projectId}?page=${page}&limit=${limit}`;
    
    if (title.trim() !== '') {
      backendUrl += `&title=${encodeURIComponent(title.trim())}`;
    }

    const response = await axios.get(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching bugs by project:", error);
    
    let errorMessage = "Failed to fetch bugs";
    
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
