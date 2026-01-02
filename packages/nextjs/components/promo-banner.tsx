"use client";

import { useState, useEffect } from "react";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("brolli-promo-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("brolli-promo-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-center">
          <span className="font-bold text-lg">
            🎉 Holiday Hacker Special: $99 (Save $100) • Ends Jan 9, 2026
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss banner"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

