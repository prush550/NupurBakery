'use client';

import { useRouter } from 'next/navigation';

export default function HiddenScrew() {
  const router = useRouter();

  const handleClick = () => {
    // Store that user found the screw
    sessionStorage.setItem('foundScrew', 'true');
    router.push('/products?hunt=active');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block opacity-20 hover:opacity-60 transition-opacity cursor-pointer"
      title=""
      aria-label="decoration"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-gray-500"
      >
        {/* Screw/Bolt SVG */}
        <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4M12 7C10.34 7 9 8.34 9 10V14C9 15.66 10.34 17 12 17C13.66 17 15 15.66 15 14V10C15 8.34 13.66 7 12 7M12 9C12.55 9 13 9.45 13 10V14C13 14.55 12.55 15 12 15C11.45 15 11 14.55 11 14V10C11 9.45 11.45 9 12 9Z" />
      </svg>
    </button>
  );
}
