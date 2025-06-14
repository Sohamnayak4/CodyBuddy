"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NoAuth from "@/components/NoAuth";
import ConnectLeetcodeModal from "@/components/ConnectLeetcodeModal";
import ConnectCodeforcesModal from "@/components/ConnectCodeforcesModal";
import ConnectCodeChefModal from "@/components/ConnectCodeChefModal";
import LeetCodeSummary from "@/components/LeetCodeSummary";
import CodeforcesSummary from "@/components/CodeforcesSummary";
import CodeChefSummary from "@/components/CodeChefSummary";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Key for storing connected accounts in localStorage
const LEETCODE_USERNAME_KEY = 'codybuddy_leetcode_username';
const CODEFORCES_USERNAME_KEY = 'codybuddy_codeforces_username';
const CODECHEF_USERNAME_KEY = 'codybuddy_codechef_username';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLeetcodeModalOpen, setIsLeetcodeModalOpen] = useState(false);
  const [isCodeforcesModalOpen, setIsCodeforcesModalOpen] = useState(false);
  const [isCodeChefModalOpen, setIsCodeChefModalOpen] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState<string | null>(null);
  const [codeforcesUsername, setCodeforcesUsername] = useState<string | null>(null);
  const [codeChefUsername, setCodeChefUsername] = useState<string | null>(null);

  // Initialize connected accounts from localStorage
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      const savedLeetcodeUsername = localStorage.getItem(LEETCODE_USERNAME_KEY);
      const savedCodeforcesUsername = localStorage.getItem(CODEFORCES_USERNAME_KEY);
      const savedCodeChefUsername = localStorage.getItem(CODECHEF_USERNAME_KEY);
      
      if (savedLeetcodeUsername) {
        setLeetcodeUsername(savedLeetcodeUsername);
      }
      
      if (savedCodeforcesUsername) {
        setCodeforcesUsername(savedCodeforcesUsername);
      }
      
      if (savedCodeChefUsername) {
        setCodeChefUsername(savedCodeChefUsername);
      }
    }
  }, []);

  // LeetCode modal handlers
  const openLeetcodeModal = () => {
    setIsLeetcodeModalOpen(true);
  };

  const closeLeetcodeModal = () => {
    setIsLeetcodeModalOpen(false);
  };

  // Codeforces modal handlers
  const openCodeforcesModal = () => {
    setIsCodeforcesModalOpen(true);
  };

  const closeCodeforcesModal = () => {
    setIsCodeforcesModalOpen(false);
  };
  
  // CodeChef modal handlers
  const openCodeChefModal = () => {
    setIsCodeChefModalOpen(true);
  };

  const closeCodeChefModal = () => {
    setIsCodeChefModalOpen(false);
  };

  // Connect LeetCode account
  const handleLeetcodeConnected = (username: string) => {
    localStorage.setItem(LEETCODE_USERNAME_KEY, username);
    setLeetcodeUsername(username);
    closeLeetcodeModal();
  };
  
  // Disconnect LeetCode account
  const disconnectLeetcodeAccount = () => {
    localStorage.removeItem(LEETCODE_USERNAME_KEY);
    setLeetcodeUsername(null);
  };
  
  // Connect Codeforces account
  const handleCodeforcesConnected = (username: string) => {
    localStorage.setItem(CODEFORCES_USERNAME_KEY, username);
    setCodeforcesUsername(username);
    closeCodeforcesModal();
  };
  
  // Disconnect Codeforces account
  const disconnectCodeforcesAccount = () => {
    localStorage.removeItem(CODEFORCES_USERNAME_KEY);
    setCodeforcesUsername(null);
  };
  
  // Connect CodeChef account
  const handleCodeChefConnected = (username: string) => {
    localStorage.setItem(CODECHEF_USERNAME_KEY, username);
    setCodeChefUsername(username);
    closeCodeChefModal();
  };
  
  // Disconnect CodeChef account
  const disconnectCodeChefAccount = () => {
    localStorage.removeItem(CODECHEF_USERNAME_KEY);
    setCodeChefUsername(null);
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Header will show different options based on auth state */}
        <Header />
        
        {/* Show main content or no auth landing page based on auth state */}
        {user ? (
          <div className="flex flex-col items-center flex-grow w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Competitive Programming Dashboard</h2>
            
            {/* Dashboard content */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* LeetCode section */}
              {leetcodeUsername ? (
                <LeetCodeSummary 
                  username={leetcodeUsername} 
                  onDisconnect={disconnectLeetcodeAccount}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">LeetCode</h3>
                  <p className="text-gray-600 mb-4">Connect your LeetCode account to see your stats here.</p>
                  <button 
                    onClick={openLeetcodeModal}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    Connect LeetCode
                  </button>
                </div>
              )}
              
              {/* Codeforces section */}
              {codeforcesUsername ? (
                <CodeforcesSummary 
                  username={codeforcesUsername} 
                  onDisconnect={disconnectCodeforcesAccount}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4 text-red-600">Codeforces</h3>
                  <p className="text-gray-600 mb-4">Connect your Codeforces account to see your stats here.</p>
                  <button 
                    onClick={openCodeforcesModal}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Connect Codeforces
                  </button>
                </div>
              )}
              
              {/* CodeChef section */}
              {codeChefUsername ? (
                <CodeChefSummary 
                  username={codeChefUsername} 
                  onDisconnect={disconnectCodeChefAccount}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4 text-green-600">CodeChef</h3>
                  <p className="text-gray-600 mb-4">Connect your CodeChef account to see your stats here.</p>
                  <button 
                    onClick={openCodeChefModal}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Connect CodeChef
                  </button>
                </div>
              )}
            </div>
            
            {/* LeetCode Connection Modal */}
            <ConnectLeetcodeModal 
              isOpen={isLeetcodeModalOpen} 
              onClose={closeLeetcodeModal}
              onConnected={handleLeetcodeConnected}
            />
            
            {/* Codeforces Connection Modal */}
            <ConnectCodeforcesModal 
              isOpen={isCodeforcesModalOpen} 
              onClose={closeCodeforcesModal}
              onConnected={handleCodeforcesConnected}
            />
            
            {/* CodeChef Connection Modal */}
            <ConnectCodeChefModal 
              isOpen={isCodeChefModalOpen} 
              onClose={closeCodeChefModal}
              onConnected={handleCodeChefConnected}
            />
          </div>
        ) : (
          <NoAuth />
        )}
      </div>
    </>
  );
}
