import { cookies } from "next/headers";

async function getMyCookieValue() {
    const cookiesList = cookies();
    const myCookie = (await cookiesList).get("accessToken");

    if (myCookie) {
      return myCookie.value;
    }
    return null;
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
}

export default getMyCookieValue;