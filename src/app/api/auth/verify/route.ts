import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get token from request body
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    
    // Return user data
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    // Handle verification errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid token" },
      { status: 401 }
    );
  }
}
