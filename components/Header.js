// components/Header.js

import React from 'react';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="w-full max-w-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">Reddit Scraper</h1>
      <button
        onClick={toggleDarkMode}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          // Sun Icon for Light Mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12.34h-1m15.364 4.95l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        ) : (
          // Moon Icon for Dark Mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
            />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;
