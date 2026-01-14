'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

/**
 * ChatHeader Component
 * 
 * A clean, professional header for the CEMAC Doors Assistant.
 * Features centered layout with brand colors and proper typography hierarchy.
 */
export const ChatHeader = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Clear any local storage
        localStorage.removeItem('cemac_session_id');
        localStorage.removeItem('cemac_fingerprint');
        
        // Redirect to login
        router.push('/login');
        router.refresh();
      } else {
        // If logout fails, still redirect to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Even on error, redirect to login
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 mb-2">
              Cemac Book
            </h1>
            <p className="text-sm text-gray-500 font-normal">
              Ask me anything about our products and services
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
