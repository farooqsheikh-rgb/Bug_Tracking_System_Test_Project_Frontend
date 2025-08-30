import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    console.log('Frontend API - Fetching project with ID:', projectId);
    
    const response = await axios.get(`http://localhost:8000/api/v1/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log('Frontend API - Backend response:', response.data);
    console.log('Frontend API - Response success:', response.data.success);
    console.log('Frontend API - Project data:', response.data.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    
    let errorMessage = "Failed to fetch project";
    
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
