import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { deleteUser, findUserById, updateUser } from "@/models/user";

// Get specific user profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify requesting user is authenticated
    await getUserFromToken(token);

    // Get requested user profile
    const user = await findUserById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

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
      { status: 400 }
    );
  }
}

// Update specific user profile
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify requesting user is authenticated and authorized
    const authUser = await getUserFromToken(token);
    
    // Only allow users to update their own profile
    if (authUser._id.toString() !== params.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Update user
    await updateUser(params.id, {
      name: body.name || authUser.name,
      email: body.email || authUser.email
    });

    const updatedUser = await findUserById(params.id);

    return NextResponse.json({
      user: {
        _id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}

// Delete specific user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify requesting user is authenticated and authorized
    const authUser = await getUserFromToken(token);
    
    // Only allow users to delete their own account
    if (authUser._id.toString() !== params.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await deleteUser(params.id);

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
