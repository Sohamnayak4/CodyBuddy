"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { CodeChefUserData } from "@/types/codechef";
import { useAuth } from "@/context/AuthContext";

// Helper component for rating color
const RatingText = ({ rating }: { rating: number }) => {
  // CodeChef rating colors
  const getRatingColor = (rating: number) => {
    if (rating < 1400) return "text-gray-500"; // 1★
    if (rating < 1600) return "text-green-500"; // 2★
    if (rating < 1800) return "text-teal-500"; // 3★
    if (rating < 2000) return "text-blue-500"; // 4★
    if (rating < 2200) return "text-purple-500"; // 5★
    if (rating < 2500) return "text-orange-500"; // 6★
    return "text-red-500"; // 7★
  };

  return <span className={`font-bold ${getRatingColor(rating)}`}>{rating}</span>;
};

// Rating history chart
const RatingHistoryChart = ({ 
  ratingData 
}: { 
  ratingData: CodeChefUserData['ratingData'] 
}) => {
  if (ratingData.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Rating History</h3>
        <p className="text-gray-500">No rating history available</p>
      </div>
    );
  }
  
  // Get min and max ratings for scaling
  const ratings = ratingData.map(change => parseInt(change.rating));
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
  const pathPoints = ratingData.map((change, index) => {
    const x = (index / (ratingData.length - 1 || 1)) * chartWidth;
    const y = scaleRating(parseInt(change.rating));
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
            {ratingData.map((change, index) => {
              const x = (index / (ratingData.length - 1 || 1)) * chartWidth;
              const y = scaleRating(parseInt(change.rating));
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
        Last {ratingData.length} contests
      </div>
    </div>
  );
};

// Heat Map Chart
const HeatMapChart = ({
  heatMap
}: {
  heatMap: CodeChefUserData['heatMap']
}) => {
  if (heatMap.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Activity Heatmap</h3>
        <p className="text-gray-500">No activity data available</p>
      </div>
    );
  }

  // Find the max value for scaling
  const maxValue = Math.max(...heatMap.map(entry => entry.value));

  // Get color based on activity intensity
  const getHeatColor = (value: number) => {
    const intensity = maxValue > 0 ? (value / maxValue) : 0;
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 0.25) return "bg-green-100";
    if (intensity < 0.5) return "bg-green-300";
    if (intensity < 0.75) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Activity Heatmap</h3>
      <div className="flex flex-wrap gap-2">
        {heatMap.map((entry, index) => {
          const date = new Date(entry.date.replace(/-/g, '/'));
          return (
            <div 
              key={index}
              className="flex flex-col items-center group"
            >
              <div 
                className={`w-8 h-8 rounded-md ${getHeatColor(entry.value)} hover:shadow-md transition-all`}
                title={`${date.toLocaleDateString()}: ${entry.value} submissions`}
              />
              <div className="mt-1 text-xs text-gray-500 whitespace-nowrap">
                {date.getDate()}/{date.getMonth() + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CodeChefProfile() {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<CodeChefUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCodeChefData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/codechef/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch CodeChef data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching CodeChef data:", err);
        setError("Failed to load CodeChef profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchCodeChefData();
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
            <p className="text-gray-700">{error || "Failed to load CodeChef profile"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format date from string like "2025-05-21 22:00:06"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {userData.name}
                  </h1>
                  <div className="text-gray-600 mb-2">
                    <span className="mr-3">{userData.stars}</span>
                    {userData.countryName && (
                      <span>{userData.countryName}</span>
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
                    <RatingText rating={userData.currentRating} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Highest Rating</div>
                  <div className="text-xl font-bold">
                    <RatingText rating={userData.highestRating} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Global Rank</div>
                  <div className="text-xl font-bold">
                    {userData.globalRank.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Country Rank</div>
                  <div className="text-xl font-bold">
                    {userData.countryRank.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Activity</h2>
                
                {/* Heat Map chart */}
                <HeatMapChart heatMap={userData.heatMap} />
              </div>
            </div>
            
            <div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-purple-800 mb-2">Rating History</h2>
                
                {/* Rating history chart */}
                {userData.ratingData.length > 0 ? (
                  <RatingHistoryChart ratingData={userData.ratingData} />
                ) : (
                  <p className="text-gray-500">No rating history available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contests section */}
          {userData.ratingData.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Contests</h2>
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Contest</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Rank</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Rating</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.ratingData.map((contest, index) => {
                      // Calculate rating change if there's a previous contest
                      let ratingChange = 0;
                      if (index > 0) {
                        ratingChange = parseInt(contest.rating) - parseInt(userData.ratingData[index - 1].rating);
                      }
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            <a
                              href={`https://www.codechef.com/contests/${contest.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {contest.name}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {contest.rank}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <RatingText rating={parseInt(contest.rating)} />
                            {index > 0 && (
                              <span className={`ml-2 text-xs ${ratingChange > 0 ? "text-green-600" : "text-red-600"}`}>
                                {ratingChange > 0 ? "+" : ""}
                                {ratingChange}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(contest.end_date)}
                          </td>
                        </tr>
                      );
                    })}
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