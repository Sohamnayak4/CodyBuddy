import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { hashPassword, generateToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/models/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create new user
    const result = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = await generateToken(result.insertedId);
    
    // Return success response with token
    return NextResponse.json({
      token,
      user: {
        _id: result.insertedId,
        name: validatedData.name,
        email: validatedData.email
      }
    });

  } catch (error) {
    // Handle validation/creation errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
