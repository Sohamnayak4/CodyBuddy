import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    
    // Fetch data from the CodeChef API
    const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch CodeChef data" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching CodeChef data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching CodeChef data" },
      { status: 500 }
    );
  }
} 