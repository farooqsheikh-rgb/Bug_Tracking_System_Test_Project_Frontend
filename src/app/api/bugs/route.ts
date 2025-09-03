import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { CONSTANTS } from "@/app/constants";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(CONSTANTS.COOKIE_NAME_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.NO_TOKEN_PROVIDED },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const backendFormData = new FormData();

    formData.forEach((value, key) => {
      backendFormData.append(key, value);
    });

    const response = await axios.post(
      CONSTANTS.BACKEND_BUGS_URL,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": CONSTANTS.CONTENT_TYPE_MULTIPART_FORMDATA,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.FAILED_TO_CREATE_BUG,
    });
  }
}
