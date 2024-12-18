// frontend/components/Header.js
import { FaSun, FaMoon } from 'react-icons/fa';

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="flex justify-center items-center w-full mb-8">
      <button
        onClick={toggleDarkMode}
        className="p-2 bg-gray-800 dark:bg-gray-700 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
      </button>
    </header>
  );
}
