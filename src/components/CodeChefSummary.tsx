"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CodeChefUserData } from "@/types/codechef";

interface CodeChefSummaryProps {
  username: string;
  onDisconnect: () => void;
}

export default function CodeChefSummary({ username, onDisconnect }: CodeChefSummaryProps) {
  const [userData, setUserData] = useState<CodeChefUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to load CodeChef profile");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchCodeChefData();
    }
  }, [username]);

  // Helper function to get color based on rating
  const getRatingColor = (rating: number) => {
    if (rating < 1400) return "text-gray-500"; // 1★
    if (rating < 1600) return "text-green-500"; // 2★
    if (rating < 1800) return "text-teal-500"; // 3★
    if (rating < 2000) return "text-blue-500"; // 4★
    if (rating < 2200) return "text-purple-500"; // 5★
    if (rating < 2500) return "text-orange-500"; // 6★
    return "text-red-500"; // 7★
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-green-600">CodeChef</h3>
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-green-600">CodeChef</h3>
        <p className="text-red-500 mb-4">{error || "Failed to load profile"}</p>
        <div className="flex justify-between">
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-green-600">CodeChef</h3>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Disconnect
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-medium">{userData.name}</h4>
        <div className="text-sm text-gray-600">{userData.stars}</div>
        <div className="text-sm text-gray-600">{userData.countryName}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Rating</div>
          <div className={`font-bold ${getRatingColor(userData.currentRating)}`}>
            {userData.currentRating}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Highest</div>
          <div className={`font-bold ${getRatingColor(userData.highestRating)}`}>
            {userData.highestRating}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Global Rank</div>
          <div className="font-bold">
            #{userData.globalRank.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Country Rank</div>
          <div className="font-bold">
            #{userData.countryRank.toLocaleString()}
          </div>
        </div>
      </div>

      {userData.ratingData.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-1">Latest Contest</div>
          <div className="text-xs text-gray-600">
            {userData.ratingData[userData.ratingData.length - 1].name}
          </div>
          <div className="text-xs text-gray-600">
            Rank: {userData.ratingData[userData.ratingData.length - 1].rank}
          </div>
        </div>
      )}

      <Link
        href={`/codechef/${username}`}
        className="block w-full text-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        View Full Profile
      </Link>
    </div>
  );
} 