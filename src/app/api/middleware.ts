import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Skip auth check for login and register endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  try {
    // Get token from Authorization header
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify token and get user
    const user = await getUserFromToken(token);

    // Clone the headers to add user context
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', user._id.toString());
    requestHeaders.set('X-User-Email', user.email);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/users/:path*',
    '/api/projects/:path*',
    // Add other protected routes here
  ]
};
