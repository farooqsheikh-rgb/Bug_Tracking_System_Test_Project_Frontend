import { CONSTANTS } from "@/app/constants";
import { handleApiError } from "@/app/serverComponents/HandleAPIError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({
      success: true,
      message: CONSTANTS.SIGNOUT_SUCCESSFUL,
    });

    res.cookies.set(CONSTANTS.COOKIE_NAME_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    res.cookies.set(CONSTANTS.COOKIE_NAME_USERTYPE, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error: unknown) {
    return handleApiError({
      error,
      fallbackMessage: CONSTANTS.SIGNOUT_FAILED,
    });
  }
}
