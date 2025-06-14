import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Leetcode data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Convert submissionCalendar from string to object if it's a string
    if (data.submissionCalendar && typeof data.submissionCalendar === 'string') {
      try {
        data.submissionCalendar = JSON.parse(data.submissionCalendar);
      } catch (e) {
        console.error("Error parsing submissionCalendar:", e);
        // If parsing fails, provide empty object to avoid breaking the UI
        data.submissionCalendar = {};
      }
    }
    
    // Log the submission calendar data for debugging
    console.log("Submission Calendar:", data.submissionCalendar);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Leetcode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Leetcode data" },
      { status: 500 }
    );
  }
} 