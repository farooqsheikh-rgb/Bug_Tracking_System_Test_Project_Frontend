import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { CONSTANTS } from "@/app/constants";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(CONSTANTS.COOKIE_NAME_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.NO_TOKEN_PROVIDED },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const searchName = searchParams.get("name");
    const sort = searchParams.get("sort") || "name";
    const order = searchParams.get("order") || "asc";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "9";

    let url = CONSTANTS.BACKEND_PROJECTS_URL;

    const queryParams = new URLSearchParams();
    queryParams.append("sort", sort);
    queryParams.append("order", order);
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (searchName) {
      url = `${CONSTANTS.BACKEND_PROJECTS_URL}search`;
      queryParams.append("name", searchName);
    }

    url += `?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.FAILED_TO_FETCH_PROJECTS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(CONSTANTS.COOKIE_NAME_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.NO_TOKEN_PROVIDED },
        { status: 401 }
      );
    }

    const body = await req.json();
    const response = await axios.post(
      CONSTANTS.BACKEND_PROJECTS_URL,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON,
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.message || CONSTANTS.FAILED_TO_ADD_PROJECT },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.FAILED_TO_ADD_PROJECT,
    });
  }
}
