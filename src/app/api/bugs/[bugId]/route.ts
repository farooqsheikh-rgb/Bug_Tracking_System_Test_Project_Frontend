import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { CONSTANTS } from "@/app/constants";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bugId: string }> }
) {
  try {
    const { bugId } = await params;
    const token = request.cookies.get(CONSTANTS.COOKIE_NAME_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.NO_TOKEN_PROVIDED },
        { status: 401 }
      );
    }

    const response = await axios.delete(
      `${CONSTANTS.BACKEND_BUGS_URL}${bugId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.FAILED_TO_DELETE_BUG,
    });
  }
}
