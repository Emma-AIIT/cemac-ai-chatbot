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
    <header className="bg-[var(--light-surface)]/80 backdrop-blur-2xl border-b border-[var(--light-border)] relative z-30">
      <div className="max-w-5xl mx-auto px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Section */}
          <div className="flex-1 text-center slide-in-left">
            <div className="flex items-center justify-center gap-3 mb-2">
              {/* Decorative animated dot */}
              <div className="w-2 h-2 rounded-full breathe" style={{ background: 'linear-gradient(135deg, var(--cemac-orange), var(--cemac-orange-dark))', boxShadow: '0 0 8px rgba(255, 107, 53, 0.4)' }}></div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--cemac-orange)] via-[var(--cemac-orange-dark)] to-[var(--cemac-orange)] text-display tracking-tight animate-gradient">
                Cemac Book
              </h1>
              <div className="w-2 h-2 rounded-full breathe" style={{ background: 'linear-gradient(135deg, var(--cemac-orange), var(--cemac-orange-dark))', boxShadow: '0 0 8px rgba(255, 107, 53, 0.4)', animationDelay: '1s' }}></div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              Your intelligent assistant for doors, hardware & solutions
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--cemac-orange)] bg-[var(--light-surface-dark)] hover:bg-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed warm-shadow hover:warm-shadow-lg border border-[var(--light-border)] hover:border-[var(--cemac-orange)]/30 slide-in-right"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Subtle underline gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cemac-orange)]/30 to-transparent"></div>
    </header>
  );
};
