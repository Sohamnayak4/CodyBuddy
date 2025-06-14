import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} CodyBuddy. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm mr-4">Follow me:</span>
            <Link
              href="https://x.com/soham_nayak04" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-600">
            <span>LeetCode profile data powered by </span>
            <Link
              href="https://leetcode-api-faisalshohag.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              LeetCode API
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
