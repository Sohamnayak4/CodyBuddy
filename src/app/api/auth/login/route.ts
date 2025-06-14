import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { validateLogin, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);
    
    // Validate credentials and get user
    const user = await validateLogin(validatedData);
    
    // Generate JWT token
    const token = await generateToken(user._id);
    
    // Return success response with token
    return NextResponse.json({ 
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    // Handle validation/auth errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
