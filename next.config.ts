import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'userpic.codeforces.org', // Codeforces profile images
      'cdn.codeforces.com',     // Codeforces assets
      'st.codeforces.com'       // Codeforces static content
    ],
  },
};

export default nextConfig;
