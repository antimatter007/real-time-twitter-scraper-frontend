// frontend/components/Button.js
import { FaSpinner } from 'react-icons/fa';

export default function Button({ children, onClick, type = 'button', className = '', isLoading = false, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full sm:w-auto px-6 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full transition-colors duration-300 flex items-center justify-center ${className}`}
    >
      {isLoading && <FaSpinner className="animate-spin mr-2" />}
      {children}
    </button>
  );
}
