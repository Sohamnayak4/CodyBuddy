"use client";

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user data");
  }

  return response.json();
}

export async function logoutUser() {
  localStorage.removeItem("token");
} 