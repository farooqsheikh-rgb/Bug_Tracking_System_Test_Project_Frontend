import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
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

    const response = await axios.delete(
      `http://localhost:8000/api/v1/bugs/${bugId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error deleting bug:", error);

    let errorMessage = "Failed to delete bug";
    let statusCode = 500;

    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
        status?: number;
      };
      message?: string;
    };

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }

    statusCode = err.response?.status || 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
