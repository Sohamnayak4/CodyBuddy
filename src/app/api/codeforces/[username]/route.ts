import { NextResponse } from "next/server";
import { CodeforcesSubmission, CodeforcesUserData } from "@/types/codeforces";

export async function GET(
  request: Request,
  context: { params: { username: string } }
) {
  const handle = context.params.username;

  try {
    // Fetch user info
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Codeforces user data" },
        { status: userResponse.status }
      );
    }
    const userData = await userResponse.json();
    
    if (userData.status !== "OK") {
      return NextResponse.json(
        { error: userData.comment || "Failed to fetch Codeforces user data" },
        { status: 400 }
      );
    }
    
    // Fetch ALL available user submissions (not just the last 100)
    // Codeforces API limits to 10000 submissions at most, but we'll use 1000 to be safe
    const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
    if (!submissionsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Codeforces submissions" },
        { status: submissionsResponse.status }
      );
    }
    const submissionsData = await submissionsResponse.json();
    
    // Fetch rating changes
    const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
    if (!ratingResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Codeforces rating changes" },
        { status: ratingResponse.status }
      );
    }
    const ratingData = await ratingResponse.json();
    
    // Process submissions to get statistics
    const submissions = submissionsData.status === "OK" ? submissionsData.result : [];
    const problemStats = processSubmissions(submissions);
    
    // Combine all data
    const combinedData: CodeforcesUserData = {
      user: userData.result[0],
      submissions: submissions.slice(0, 100), // Return only 100 submissions for UI display
      ratingChanges: ratingData.status === "OK" ? ratingData.result : [],
      problemStats
    };
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Codeforces data" },
      { status: 500 }
    );
  }
}

function processSubmissions(submissions: CodeforcesSubmission[]) {
  // Track unique solved problems
  const solvedProblems = new Set<string>();
  const tagCounts: Record<string, number> = {};
  const ratingCounts: Record<string, number> = {};
  const verdictCounts: Record<string, number> = {};
  const languageCounts: Record<string, number> = {};
  
  submissions.forEach(submission => {
    // Skip submissions without a problem
    if (!submission.problem) return;
    
    // Count verdicts
    const verdict = submission.verdict || "UNKNOWN";
    verdictCounts[verdict] = (verdictCounts[verdict] || 0) + 1;
    
    // Count languages
    const language = submission.programmingLanguage;
    languageCounts[language] = (languageCounts[language] || 0) + 1;
    
    // Create a unique identifier for this problem
    const problemId = `${submission.problem.contestId || 0}-${submission.problem.index}-${submission.problem.name}`;
    
    // Only count accepted solutions for problem stats
    if (submission.verdict === "OK") {
      // Only count each problem once
      if (!solvedProblems.has(problemId)) {
        solvedProblems.add(problemId);
        
        // Count by tags
        if (submission.problem.tags && Array.isArray(submission.problem.tags)) {
          submission.problem.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
        
        // Count by rating
        if (submission.problem.rating) {
          const rating = submission.problem.rating.toString();
          ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        }
      }
    }
  });
  
  return {
    totalSolved: solvedProblems.size,
    byTags: tagCounts,
    byRating: ratingCounts,
    verdictCounts,
    languageCounts
  };
} 