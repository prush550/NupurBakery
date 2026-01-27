'use client';

import { useState, useEffect } from 'react';
import TreasureVault from './TreasureVault';

export default function HiddenNut() {
  const [showVault, setShowVault] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if user found the screw first
    const foundScrew = sessionStorage.getItem('foundScrew');
    const urlParams = new URLSearchParams(window.location.search);
    const huntActive = urlParams.get('hunt') === 'active';

    if (foundScrew === 'true' || huntActive) {
      setIsActive(true);
    }
  }, []);

  const handleClick = () => {
    if (isActive) {
      // Clear the screw flag and open vault
      sessionStorage.removeItem('foundScrew');
      setShowVault(true);
    }
  };

  if (!isActive) return null;

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-20 right-4 opacity-25 hover:opacity-70 transition-opacity cursor-pointer z-40"
        title=""
        aria-label="decoration"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-600"
        >
          {/* Hexagonal Nut SVG */}
          <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2M12 4.15L18 7.87V16.13L12 19.85L6 16.13V7.87L12 4.15M12 8C9.79 8 8 9.79 8 12S9.79 16 12 16 16 14.21 16 12 14.21 8 12 8M12 14C10.9 14 10 13.1 10 12S10.9 10 12 10 14 10.9 14 12 13.1 14 12 14Z" />
        </svg>
      </button>

      <TreasureVault isOpen={showVault} onClose={() => setShowVault(false)} />
    </>
  );
}
