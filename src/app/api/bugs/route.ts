import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const backendFormData = new FormData();
    
    formData.forEach((value, key) => {
      backendFormData.append(key, value);
    });

    const response = await axios.post(
      `http://localhost:8000/api/v1/bugs`,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error creating bug:", error);
    
    let errorMessage = "Failed to create bug";
    
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
