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

    const { searchParams } = new URL(req.url);
    const searchName = searchParams.get('name');
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '9';

    
    let url = "http://localhost:8000/api/v1/projects";
    
    const queryParams = new URLSearchParams();
    queryParams.append('sort', sort);
    queryParams.append('order', order);
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (searchName) {
      url = `http://localhost:8000/api/v1/projects/search`;
      queryParams.append('name', searchName);
    }
    
    url += `?${queryParams.toString()}`;

    console.log('Making request to:', url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log('Backend response status:', response.status);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
        status?: number;
      };
    };

    console.error('Frontend API route error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      fullError: error,
    });

    let errorMessage = "Failed to fetch projects";

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }

    const statusCode = err.response?.status || 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
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
        { success: false, error: data.message || "Creating Project failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
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
        error: err.response?.data?.error,
      },
      { status: err.response?.status || 500 }
    );
  }
}
