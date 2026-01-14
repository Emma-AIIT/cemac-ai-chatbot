'use client';

/**
 * ChatHeader Component
 * 
 * A clean, professional header for the CEMAC Doors Assistant.
 * Features centered layout with brand colors and proper typography hierarchy.
 */
export const ChatHeader = () => {
  return (
    <header className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 mb-2">
            Cemac Book
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Ask me anything about our products and services
          </p>
        </div>
      </div>
    </header>
  );
};
