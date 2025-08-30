import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    console.log('API route called, token:', token ? 'present' : 'missing');

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

    console.log('Search params:', { searchName, sort, order, page, limit });

    let url = "http://localhost:8000/api/v1/projects";
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('sort', sort);
    queryParams.append('order', order);
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    // If search parameter is provided, use the search endpoint
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
  } catch (error: any) {
    console.error('Frontend API route error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      fullError: error
    });
    
    // Try to extract the actual error message from different possible structures
    let errorMessage = "Failed to fetch projects";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
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
