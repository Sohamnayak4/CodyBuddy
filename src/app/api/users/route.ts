import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { findUserById, findUserByEmail, updateUser, deleteUser } from "@/models/user";

// Get user profile
export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 401 }
    );
  }
}

// Update user profile
export async function PUT(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    const body = await request.json();

    // Check if email is being updated and if it's already taken
    if (body.email && body.email !== user.email) {
      const existingUser = await findUserByEmail(body.email);
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already taken" },
          { status: 400 }
        );
      }
    }

    // Update user
    await updateUser(user._id, {
      name: body.name || user.name,
      email: body.email || user.email
    });

    return NextResponse.json({
      user: {
        _id: user._id,
        name: body.name || user.name,
        email: body.email || user.email
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}

// Delete user account
export async function DELETE(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    await deleteUser(user._id);

    return NextResponse.json({
      message: "User account deleted successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
