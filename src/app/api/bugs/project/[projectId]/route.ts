import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { CONSTANTS } from "@/app/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const token = request.cookies.get(CONSTANTS.COOKIE_NAME_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.NO_TOKEN_PROVIDED },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const title = searchParams.get("title") || "";

    let backendUrl = `${CONSTANTS.BACKEND_BUGS_URL}project/${projectId}?page=${page}&limit=${limit}`;

    if (title.trim() !== "") {
      backendUrl += `&title=${encodeURIComponent(title.trim())}`;
    }

    const response = await axios.get(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.FAILED_TO_FETCH_BUGS,
    });
  }
}
