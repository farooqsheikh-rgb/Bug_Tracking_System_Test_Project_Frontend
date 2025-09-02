import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const response = await axios.get(
      `http://localhost:8000/api/v1/projects/${id}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error fetching project members:", error);

    let errorMessage = "Failed to fetch project members";
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Assigning users to project:", id, "with body:", body);

    const response = await axios.post(
      `http://localhost:8000/api/v1/projects/${id}/members`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend assignment response:", response.data);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error assigning users to project:", error);

    let errorMessage = "Failed to assign users to project";
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
