import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CodeforcesUserData } from '@/types/codeforces';

interface CodeforcesSummaryProps {
  username: string;
  onDisconnect: () => void;
}

export default function CodeforcesSummary({ username, onDisconnect }: CodeforcesSummaryProps) {
  const [userData, setUserData] = useState<CodeforcesUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.error("Error fetching codeforces data:", err);
        setError("Failed to load Codeforces profile");
      } finally {
        setLoading(false);
      }
    }

    fetchCodeforcesData();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-red-600">Codeforces</h3>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-red-600">Codeforces</h3>
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
            className="text-sm text-red-600 hover:text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get rating color based on Codeforces rating
  const getRatingColor = (rating: number) => {
    if (rating < 1200) return "text-gray-500";
    if (rating < 1400) return "text-green-500";
    if (rating < 1600) return "text-cyan-500";
    if (rating < 1900) return "text-blue-500";
    if (rating < 2100) return "text-purple-500";
    if (rating < 2400) return "text-yellow-500";
    return "text-red-500";
  };

  const { user, problemStats } = userData;
  const ratingColor = getRatingColor(user.rating || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-red-600">Codeforces</h3>
        <button 
          onClick={onDisconnect}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Disconnect
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="mr-3">
          <Image 
            src={user.titlePhoto} 
            alt={user.handle} 
            width={40} 
            height={40} 
            className="rounded-full"
          />
        </div>
        <div>
          <h4 className="font-medium text-lg">{username}</h4>
          <p className="text-sm text-gray-600">
            Rank: <span className="font-semibold">{user.rank || 'Unrated'}</span>
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium mb-1">Current Rating</div>
        <div className={`text-2xl font-bold ${ratingColor}`}>
          {user.rating || 'Unrated'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Max Rating</div>
          <div className={`text-lg font-bold ${getRatingColor(user.maxRating || 0)}`}>
            {user.maxRating || 'N/A'}
          </div>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Problems Solved</div>
          <div className="text-lg font-bold text-blue-600">
            {problemStats.totalSolved}
          </div>
        </div>
      </div>
      
      <Link 
        href={`/codeforces/${username}`}
        className="block w-full text-center py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
      >
        View Full Profile
      </Link>
    </div>
  );
} 