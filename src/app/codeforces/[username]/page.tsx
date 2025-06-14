"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { CodeforcesUserData } from "@/types/codeforces";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// Helper component for rating color
const RatingText = ({ rating }: { rating: number }) => {
  // Codeforces rating colors
  const getRatingColor = (rating: number) => {
    if (rating < 1200) return "text-gray-500"; // Newbie
    if (rating < 1400) return "text-green-500"; // Pupil
    if (rating < 1600) return "text-teal-500"; // Specialist
    if (rating < 1900) return "text-blue-500"; // Expert
    if (rating < 2100) return "text-purple-500"; // Candidate Master
    if (rating < 2400) return "text-orange-500"; // Master
    if (rating < 2600) return "text-orange-600"; // International Master
    if (rating < 3000) return "text-red-500"; // Grandmaster
    return "text-red-600"; // International Grandmaster / Legendary Grandmaster
  };

  return <span className={`font-bold ${getRatingColor(rating)}`}>{rating}</span>;
};

// Chart component for problem tags
const TagsChart = ({ 
  tagCounts 
}: { 
  tagCounts: Record<string, number> 
}) => {
  // Sort tags by count
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Show top 10 tags
  
  const maxCount = Math.max(...sortedTags.map(([_, count]) => count));
  
  // Generate a color for each tag (using a consistent color scheme)
  const getTagColor = (index: number) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-indigo-400 to-indigo-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-teal-400 to-teal-600',
      'from-cyan-400 to-cyan-600',
      'from-violet-400 to-violet-600',
      'from-sky-400 to-sky-600',
      'from-emerald-400 to-emerald-600',
      'from-fuchsia-400 to-fuchsia-600'
    ];
    return colors[index % colors.length];
  };
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3">Problem Tags</h3>
      <div className="space-y-3">
        {sortedTags.map(([tag, count], index) => (
          <div key={tag} className="flex items-center group hover:bg-gray-50 p-1 rounded transition-colors">
            <div className="w-32 text-sm truncate font-medium group-hover:text-blue-700 transition-colors" title={tag}>
              {tag}
            </div>
            <div className="flex-grow mx-2">
              <div className="bg-gray-200 rounded-full h-4 w-full shadow-inner overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${getTagColor(index)} h-4 rounded-full transition-all duration-500 group-hover:shadow`} 
                  style={{ 
                    width: `${(count / maxCount) * 100}%`,
                    minWidth: '12px'
                  }}
                />
              </div>
            </div>
            <div className="ml-1 text-sm font-medium text-gray-600 w-10 text-right group-hover:text-blue-700 transition-colors">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart component for problem ratings
const RatingDistributionChart = ({ 
  ratingCounts 
}: { 
  ratingCounts: Record<string, number> 
}) => {
  // Convert ratings to numbers for sorting
  const sortedRatings = Object.entries(ratingCounts)
    .map(([rating, count]) => [parseInt(rating), count])
    .sort((a, b) => (a[0] as number) - (b[0] as number));
  
  // Find the max count for scaling
  const maxCount = Math.max(...sortedRatings.map(([_, count]) => count as number));
  
  // Color mapping for different ratings with gradient effect
  const getRatingColor = (rating: number) => {
    if (rating < 1200) return "from-gray-400 to-gray-600";
    if (rating < 1400) return "from-green-400 to-green-600";
    if (rating < 1600) return "from-teal-400 to-teal-600";
    if (rating < 1900) return "from-blue-400 to-blue-600";
    if (rating < 2100) return "from-purple-400 to-purple-600";
    if (rating < 2400) return "from-orange-400 to-orange-600";
    if (rating < 2600) return "from-orange-500 to-orange-700";
    if (rating < 3000) return "from-red-400 to-red-600";
    return "from-red-500 to-red-700";
  };
  
  // Maximum height for bars in pixels
  const MAX_BAR_HEIGHT = 160; // pixels
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Problem Rating Distribution</h3>
      <div className="flex items-end h-82 gap-2 overflow-x-auto pb-8 pt-1 px-1">
        {sortedRatings.map(([rating, count]) => {
          // Calculate the height in pixels based on the count
          // Minimum height of 10px for visibility
          const heightPx = maxCount > 0 
            ? Math.max(Math.floor((count as number) / maxCount * MAX_BAR_HEIGHT), 10)
            : 10;
          
          return (
            <div 
              key={rating} 
              className="flex flex-col items-center flex-shrink-0 group"
              style={{ minWidth: '35px', maxWidth: '50px', width: `${100 / Math.min(sortedRatings.length, 10)}%` }}
            >
              <div className="text-xs font-medium text-gray-600 mb-1 transition-all group-hover:text-gray-900">
                {count}
              </div>
              <div 
                className={`w-full bg-gradient-to-t ${getRatingColor(rating as number)} shadow-sm hover:shadow transition-all`} 
                style={{ 
                  height: `${heightPx}px`,
                  borderRadius: '4px'
                }}
                title={`${rating}: ${count} problems (${heightPx}px height)`}
              />
              <div className="text-xs font-medium text-gray-600 mt-2 whitespace-nowrap transition-all group-hover:text-gray-900">
                {rating}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Rating history chart
const RatingHistoryChart = ({ 
  ratingChanges 
}: { 
  ratingChanges: CodeforcesUserData['ratingChanges'] 
}) => {
  if (ratingChanges.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Rating History</h3>
        <p className="text-gray-500">No rating history available</p>
      </div>
    );
  }
  
  // Get min and max ratings for scaling
  const ratings = ratingChanges.map(change => change.newRating);
  const minRating = Math.min(...ratings) - 100; // Add padding
  const maxRating = Math.max(...ratings) + 100; // Add padding
  const range = maxRating - minRating;
  
  // Chart height
  const chartHeight = 200;
  const chartWidth = 100;
  
  // Scale rating to chart height
  const scaleRating = (rating: number) => {
    return chartHeight - ((rating - minRating) / (range || 1)) * chartHeight;
  };
  
  // Create path for rating chart
  const pathPoints = ratingChanges.map((change, index) => {
    const x = (index / (ratingChanges.length - 1 || 1)) * chartWidth;
    const y = scaleRating(change.newRating);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Rating History</h3>
      <div className="relative h-52 w-full">
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 z-10">
          <div className="py-1">{maxRating}</div>
          <div className="py-1">{Math.round((maxRating + minRating) / 2)}</div>
          <div className="py-1">{minRating}</div>
        </div>
        
        <div className="ml-8 h-full">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            {/* Horizontal grid lines */}
            <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Rating line */}
            <polyline
              points={pathPoints}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
            
            {/* Rating points */}
            {ratingChanges.map((change, index) => {
              const x = (index / (ratingChanges.length - 1 || 1)) * chartWidth;
              const y = scaleRating(change.newRating);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#2563eb"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Last {ratingChanges.length} contests
      </div>
    </div>
  );
};

export default function CodeforcesProfile() {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<CodeforcesUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCodeforcesData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/codeforces/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Codeforces data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching Codeforces data:", err);
        setError("Failed to load Codeforces profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchCodeforcesData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="bg-white p-8 rounded-lg shadow max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{error || "Failed to load Codeforces profile"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* User profile header */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <Image
                src={userData.user.titlePhoto}
                alt={userData.user.handle}
                width={128}
                height={128}
                className="rounded-lg"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {userData.user.handle}
                  </h1>
                  <div className="text-gray-600 mb-2">
                    {userData.user.firstName && userData.user.lastName && (
                      <span className="mr-3">{userData.user.firstName} {userData.user.lastName}</span>
                    )}
                    {userData.user.organization && (
                      <span className="mr-3">from {userData.user.organization}</span>
                    )}
                    {userData.user.country && (
                      <span>{userData.user.country}</span>
                    )}
                  </div>
                </div>
                
                {user && user.name === username && (
                  <div className="mt-2 md:mt-0 px-4 py-2 bg-green-100 text-green-800 rounded-md">
                    This is your profile
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Current Rating</div>
                  <div className="text-xl font-bold">
                    <RatingText rating={userData.user.rating} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Max Rating</div>
                  <div className="text-xl font-bold">
                    <RatingText rating={userData.user.maxRating} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Rank</div>
                  <div className="text-xl font-bold capitalize">
                    {userData.user.rank}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Contribution</div>
                  <div className="text-xl font-bold">
                    {userData.user.contribution}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Problem stats section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Problem Statistics</h2>
                <div className="text-3xl font-bold text-blue-600">
                  {userData.problemStats.totalSolved} <span className="text-lg text-gray-500">problems solved</span>
                </div>
                
                {/* Tags chart */}
                <TagsChart tagCounts={userData.problemStats.byTags} />
              </div>
            </div>
            
            <div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-purple-800 mb-2">Rating Distribution</h2>
                
                {/* Rating distribution chart */}
                {Object.keys(userData.problemStats.byRating).length > 0 ? (
                  <RatingDistributionChart ratingCounts={userData.problemStats.byRating} />
                ) : (
                  <p className="text-gray-500">No rating data available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Rating history */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mb-8 overflow-hidden">
            <RatingHistoryChart ratingChanges={userData.ratingChanges} />
          </div>
          
          {/* Recent submissions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Submissions</h2>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Problem</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Verdict</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Language</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Time (ms)</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Memory (KB)</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userData.submissions.slice(0, 10).map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        <a
                          href={`https://codeforces.com/contest/${submission.problem.contestId}/problem/${submission.problem.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {submission.problem.name}
                        </a>
                        <div className="text-xs text-gray-500">
                          {submission.problem.contestId}-{submission.problem.index}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.verdict === "OK" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {submission.verdict || "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {submission.programmingLanguage}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {submission.timeConsumedMillis}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {Math.round(submission.memoryConsumedBytes / 1024)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(submission.creationTimeSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Contests section */}
          {userData.ratingChanges.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Contests</h2>
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Contest</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Rank</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Old Rating</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">New Rating</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Change</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.ratingChanges.slice(-10).reverse().map((contest, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          <a
                            href={`https://codeforces.com/contest/${contest.contestId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {contest.contestName}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {contest.rank}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <RatingText rating={contest.oldRating} />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <RatingText rating={contest.newRating} />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={contest.newRating > contest.oldRating ? "text-green-600" : "text-red-600"}>
                            {contest.newRating > contest.oldRating ? "+" : ""}
                            {contest.newRating - contest.oldRating}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(contest.ratingUpdateTimeSeconds)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 