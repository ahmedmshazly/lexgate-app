import { NextResponse, type NextRequest } from "next/server";

const localePattern = /^\/(ar|en)(?:\/|$)/;

/**
 * Propagates the route locale to the root layout. This keeps the root HTML
 * language and writing direction accurate for browser and assistive tooling.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = request.nextUrl.pathname.match(localePattern)?.[1] ?? "en";
  requestHeaders.set("x-lexgate-locale", locale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
