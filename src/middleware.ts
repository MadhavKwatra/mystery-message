import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // token exist and user is trying to access sign-in, sign-up, verify or home page
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    console.log("Have token CONDITION");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  console.log(request.url, "In Middleware");
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/profile") ||
      url.pathname.startsWith("/feedbacks"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
  //   return NextResponse.redirect(new URL("/home", request.url));
}

//define Where to run middleware
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
    "/profile/:path*",
    "/feedbacks/:path*"
  ]
};
