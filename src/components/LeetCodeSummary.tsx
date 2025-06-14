import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeetcodeUserData } from '@/types/leetcode';

interface LeetCodeSummaryProps {
  username: string;
  onDisconnect: () => void;
}

export default function LeetCodeSummary({ username, onDisconnect }: LeetCodeSummaryProps) {
  const [userData, setUserData] = useState<LeetcodeUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeetcodeData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/leetcode/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch LeetCode data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching leetcode data:", err);
        setError("Failed to load LeetCode profile");
      } finally {
        setLoading(false);
      }
    }

    fetchLeetcodeData();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-600">LeetCode</h3>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-600">LeetCode</h3>
          <button 
            onClick={onDisconnect}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Disconnect
          </button>
        </div>
        <div className="py-4 text-center">
          <p className="text-gray-500 mb-2">Failed to load profile</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-600">LeetCode</h3>
        <button 
          onClick={onDisconnect}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Disconnect
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-lg">{username}</h4>
        <p className="text-sm text-gray-600">
          Ranking: <span className="font-semibold">#{userData.ranking.toLocaleString()}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 p-2 rounded">
          <div className="text-xs text-gray-500">Easy</div>
          <div className="text-lg font-bold text-green-600">{userData.easySolved}/{userData.totalEasy}</div>
        </div>
        
        <div className="bg-yellow-50 p-2 rounded">
          <div className="text-xs text-gray-500">Medium</div>
          <div className="text-lg font-bold text-yellow-600">{userData.mediumSolved}/{userData.totalMedium}</div>
        </div>
        
        <div className="bg-red-50 p-2 rounded">
          <div className="text-xs text-gray-500">Hard</div>
          <div className="text-lg font-bold text-red-600">{userData.hardSolved}/{userData.totalHard}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium mb-1">Total Solved</div>
        <div className="text-2xl font-bold">
          {userData.totalSolved} <span className="text-sm text-gray-500">/ {userData.totalQuestions}</span>
        </div>
      </div>
      
      <Link 
        href={`/leetcode/${username}`}
        className="block w-full text-center py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
      >
        View Full Profile
      </Link>
    </div>
  );
} 