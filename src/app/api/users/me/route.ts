import { NextResponse } from "next/server";
import { verifyToken, getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }
    
    // Extract token
    const token = authHeader.split(" ")[1];
    
    // Get user from token
    const user = await getUserFromToken(token);
    
    // Return user data without the password
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // Add any other user fields you want to expose
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 401 }
    );
  }
} 