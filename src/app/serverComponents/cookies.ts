import { cookies } from "next/headers";

async function getMyCookieValue() {
    const cookiesList = cookies();
    const myCookie = (await cookiesList).get("accessToken");

    if (myCookie) {
      return myCookie.value;
    }
    return null;
}

export default getMyCookieValue;