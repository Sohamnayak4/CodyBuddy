"use client";

import Link from "next/link";
import { useState } from "react";

export default function NoAuth() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'platforms'>('overview');
  
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Your Competitive Programming</span>
            <span className="block text-blue-600">All in One Place</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Combine your Leetcode, Codeforces, and Codechef profiles in one elegant dashboard.
            Track your progress, analyze your performance, and improve your skills.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/signin" 
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`${
                  activeTab === 'features'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('platforms')}
                className={`${
                  activeTab === 'platforms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              >
                Platforms
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-10">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why CodyBuddy?</h2>
                <p className="text-gray-600 mb-4">
                  CodyBuddy brings together your competitive programming profiles from multiple platforms,
                  giving you a unified view of your progress and performance.
                </p>
                <p className="text-gray-600">
                  Instead of switching between different websites to check your stats,
                  get everything you need in one beautiful dashboard.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How it Works</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Create your CodyBuddy account</li>
                  <li>Connect your competitive programming profiles</li>
                  <li>View your unified dashboard with statistics from all platforms</li>
                  <li>Track your progress and identify areas for improvement</li>
                </ol>
              </div>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Unified Dashboard",
                  description: "See all your stats in one place with an intuitive and clean interface."
                },
                {
                  title: "Progress Tracking",
                  description: "Track your solving history and see how you&apos;re improving over time."
                },
                {
                  title: "Problem Recommendations",
                  description: "Get personalized problem recommendations based on your skill level."
                },
                {
                  title: "Performance Analytics",
                  description: "Detailed analytics to help you understand your strengths and weaknesses."
                },
                {
                  title: "Contest Calendar",
                  description: "Never miss a contest with our integrated calendar for all platforms."
                },
                {
                  title: "Social Features",
                  description: "Compare your progress with friends and compete on leaderboards."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'platforms' && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">LeetCode</h2>
                <p className="text-gray-600 mb-4">
                  Track your LeetCode problem-solving history, submission activities, and see detailed statistics
                  about the types of problems you've solved.
                </p>
                <div className="text-sm text-gray-500 mt-4">
                  <span className="font-medium">Supported features:</span>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Problem count by difficulty (Easy, Medium, Hard)</li>
                    <li>Submission activity heatmap</li>
                    <li>Recent submissions with status</li>
                    <li>Overall progress visualization</li>
                    <li>Detailed submission statistics</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Codeforces</h2>
                <p className="text-gray-600 mb-4">
                  View your Codeforces rating history, contest performances, and problem-solving statistics
                  all integrated into your CodyBuddy dashboard.
                </p>
                <div className="text-sm text-gray-500 mt-4">
                  <span className="font-medium">Supported features:</span>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Rating and rank history</li>
                    <li>Contest participation and results</li>
                    <li>Problem tags analysis</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CodeChef</h2>
                <p className="text-gray-600 mb-4">
                  Integrate your CodeChef profile to track your rating changes, contest performances, and
                  problem-solving patterns alongside your other platforms.
                </p>
                <div className="text-sm text-gray-500 mt-4">
                  <span className="font-medium">Supported features:</span>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Star rating and ranking</li>
                    <li>Long, Cook-off, and Lunchtime contests</li>
                    <li>Problem-solving history</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join CodyBuddy today and take your competitive programming to the next level.
          </p>
          <div className="mt-6">
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
