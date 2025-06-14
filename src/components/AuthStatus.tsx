"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (token) {
      // Simple token validation
      try {
        // For demo purposes, we're just checking if the token exists
        // In a real app, you would verify the token with the server
        const userData = { name: "User" }; // Placeholder
        setUser(userData);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-gray-800">
        Logged in as <span className="font-bold">{user.name}</span>
      </p>
      <button
        onClick={handleLogout}
        className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
} 