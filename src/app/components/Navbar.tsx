'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Tank of War
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/' ? 'text-white bg-purple-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  Home
                </Link>
                <Link
                  href="/matches"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/matches') ? 'text-white bg-purple-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  View Matches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}