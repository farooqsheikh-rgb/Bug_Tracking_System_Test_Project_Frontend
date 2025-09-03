import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { CONSTANTS } from "@/app/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.post(
      CONSTANTS.BACKEND_SIGNIN_URL,
      body,
      {
        headers: { "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON },
      }
    );

    const data = response.data;

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: CONSTANTS.SIGNUP_FAILED },
        { status: 400 }
      );
    }

    const userData = data.data;
    const accessToken = userData.accessToken;

    const res = NextResponse.json({ success: true, user: userData });

    res.cookies.set(CONSTANTS.COOKIE_NAME_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set(
      CONSTANTS.COOKIE_NAME_USERTYPE,
      userData.user_type || userData.userType || "developer",
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return res;
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.INVALID_EMAIL_OR_PASSWORD,
    });
  }
}
