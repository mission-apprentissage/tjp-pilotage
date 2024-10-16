import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isImageURL(url: string) {
  const imagePattern = /\.(svg|png|jpe?g|gif|bmp|webp|tiff?)$/i;
  return imagePattern.test(url);
}

export async function middleware(request: NextRequest) {
  if (isImageURL(request.url)) return NextResponse.next();

  const { isMaintenance } = await fetch(
    process.env.NEXT_PUBLIC_APP_CONTAINER_URL + "/maintenance",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json() as Promise<{ isMaintenance: boolean }>);

  if (isMaintenance) {
    console.log("Maintenance mode");

    const nextUrl = new URL("/maintenance", request.url);

    return NextResponse.redirect(nextUrl.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|maintenance|_next/static|_next/image|illustrations|favicon.ico|logo_orion.svg|logo_gouvernement.svg).*)",
  ],
};
