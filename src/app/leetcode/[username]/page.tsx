"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { LeetcodeUserData } from "@/types/leetcode";
import { useAuth } from "@/context/AuthContext";

// Component to display a progress bar
const ProgressBar = ({ 
  completed, 
  total, 
  color 
}: { 
  completed: number; 
  total: number; 
  color: string;
}) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${color}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function LeetcodeProfile() {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<LeetcodeUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchLeetcodeData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/leetcode/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Leetcode data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching leetcode data:", err);
        setError("Failed to load Leetcode profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchLeetcodeData();
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
            <p className="text-gray-700">{error || "Failed to load Leetcode profile"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to format timestamps to readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{username}&apos;s Leetcode Profile</h1>
              <p className="text-gray-600">
                Ranking: <span className="font-semibold">#{userData.ranking.toLocaleString()}</span> 
                {userData.contributionPoint > 0 && (
                  <> • Contribution Points: <span className="font-semibold">{userData.contributionPoint}</span></>
                )}
              </p>
            </div>
            
            {user && user.name === username && (
              <div className="mt-4 md:mt-0 px-4 py-2 bg-green-100 text-green-800 rounded-md">
                This is your profile
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Easy Problems</h2>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userData.easySolved} <span className="text-lg text-gray-500">/ {userData.totalEasy}</span>
              </div>
              <ProgressBar 
                completed={userData.easySolved} 
                total={userData.totalEasy} 
                color="bg-green-500" 
              />
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Medium Problems</h2>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {userData.mediumSolved} <span className="text-lg text-gray-500">/ {userData.totalMedium}</span>
              </div>
              <ProgressBar 
                completed={userData.mediumSolved} 
                total={userData.totalMedium} 
                color="bg-yellow-500" 
              />
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Hard Problems</h2>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {userData.hardSolved} <span className="text-lg text-gray-500">/ {userData.totalHard}</span>
              </div>
              <ProgressBar 
                completed={userData.hardSolved} 
                total={userData.totalHard} 
                color="bg-red-500" 
              />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Overall Progress</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-4xl font-bold text-blue-600 mb-2 md:mb-0">
                {userData.totalSolved} <span className="text-xl text-gray-500">/ {userData.totalQuestions}</span>
              </div>
              <div className="text-gray-600">
                {Math.round((userData.totalSolved / userData.totalQuestions) * 100)}% Completed
              </div>
            </div>
            <ProgressBar 
              completed={userData.totalSolved} 
              total={userData.totalQuestions} 
              color="bg-blue-500" 
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Submissions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Problem</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Language</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userData.recentSubmissions.slice(0, 10).map((submission, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        <a
                          href={`https://leetcode.com/problems/${submission.titleSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {submission.title}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.statusDisplay === "Accepted" 
                              ? "bg-green-100 text-green-800" 
                              : submission.statusDisplay === "Wrong Answer"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {submission.statusDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="text-gray-600 capitalize">{submission.lang}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(submission.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submission Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Accepted Submissions</h3>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-sm font-medium text-gray-600">Difficulty</th>
                      <th className="py-2 text-right text-sm font-medium text-gray-600">Count</th>
                      <th className="py-2 text-right text-sm font-medium text-gray-600">Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.matchedUserStats.acSubmissionNum.map((stat, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-2 text-sm">{stat.difficulty}</td>
                        <td className="py-2 text-sm text-right font-medium">{stat.count}</td>
                        <td className="py-2 text-sm text-right text-gray-600">{stat.submissions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Total Submissions</h3>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-sm font-medium text-gray-600">Difficulty</th>
                      <th className="py-2 text-right text-sm font-medium text-gray-600">Count</th>
                      <th className="py-2 text-right text-sm font-medium text-gray-600">Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.totalSubmissions.map((stat, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-2 text-sm">{stat.difficulty}</td>
                        <td className="py-2 text-sm text-right font-medium">{stat.count}</td>
                        <td className="py-2 text-sm text-right text-gray-600">{stat.submissions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 