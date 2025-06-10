import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/api/auth"];

/**
 * Middleware to check authentication status and protect routes
 */
export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Allow access to public assets
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // Get the token from the cookies
  const authToken = request.cookies.get("auth-token")?.value;
  
  // Check if the user is authenticated or the route is public
  if (!authToken && !isPublicRoute) {
    // Redirect to login page with the original URL as query parameter
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.append("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the user is already logged in and trying to access the login page, redirect to home
  if (authToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
