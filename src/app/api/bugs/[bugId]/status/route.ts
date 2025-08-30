import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bugId: string }> }
) {
  try {
    const { bugId } = await params;
    const token = request.cookies.get("accessToken")?.value;

    console.log('Frontend API - Bug ID:', bugId);
    console.log('Frontend API - Token exists:', !!token);
    console.log('Frontend API - Token length:', token?.length);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    console.log('Frontend API - Request body:', body);
    console.log('Frontend API - Status to update:', status);

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Try to update the bug status
    try {
      console.log('Frontend API - Sending request to backend:', `http://localhost:8000/api/v1/bugs/${bugId}/status`);
      console.log('Frontend API - Request payload:', { status });
      console.log('Frontend API - Authorization header:', `Bearer ${token.substring(0, 20)}...`);
      
      const response = await axios.patch(
        `http://localhost:8000/api/v1/bugs/${bugId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Frontend API - Backend response:', response.data);
      return NextResponse.json(response.data);
    } catch (error: any) {
      console.error('Backend error response:', error.response?.data);
      console.error('Backend error status:', error.response?.status);
      
      // Handle different error scenarios
      if (error.response?.status === 403) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Access denied. You don't have permission to update this bug status." 
          },
          { status: 403 }
        );
      } else if (error.response?.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Authentication failed. Please sign in again." 
          },
          { status: 401 }
        );
      } else if (error.response?.status === 400) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.response.data?.message || "Invalid request. Please check the status value." 
          },
          { status: 400 }
        );
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error: unknown) {
    console.error("Error updating bug status:", error);
    
    let errorMessage = "Failed to update bug status";
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
