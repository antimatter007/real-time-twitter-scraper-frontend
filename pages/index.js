// frontend/pages/index.js

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Button from '../components/Button';
import TweetCard from '../components/Tweetcard';
import Header from '../components/Header';

export default function Home() {
  const [query, setQuery] = useState('');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('');
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Function to submit a new scraping job
  const submitJob = async (e) => {
    e.preventDefault();
    setError('');
    setTweets([]);
    setStatus('pending');
    setIsLoading(true);

    try {
      const res = await fetch('https://real-time-scraper-backend-production.up.railway.app/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Failed to submit job');

      const data = await res.json();
      setJobId(data.jobId);

      if (data.cached) {
        // If cached, set status to completed and display results immediately
        setStatus('completed');
        setTweets(data.results || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit job. Please ensure your backend is running and try again.');
      setStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch search history from the backend
  const fetchSearchHistory = async () => {
    try {
      const res = await fetch('https://real-time-scraper-backend-production.up.railway.app/api/search-history?limit=10');
      if (!res.ok) throw new Error('Failed to fetch search history');
      const data = await res.json();
      setSearchHistory(data.history);
    } catch (err) {
      console.error(err);
      // Optionally set an error state or ignore
    }
  };

  useEffect(() => {
    // Fetch search history when component mounts
    fetchSearchHistory();
  }, []);

  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed' || !status) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://real-time-scraper-backend-production.up.railway.app/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch job status');
        }

        const data = await res.json();
        setStatus(data.status);

        // If completed or failed, stop polling and show results
        if (data.status === 'completed' || data.status === 'failed') {
          setTweets(data.results || []);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch job status. Please check your connection.');
        clearInterval(interval);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [jobId, status]);

  // Handle fetching search history when input is focused
  const handleInputFocus = () => {
    setShowDropdown(true);
    fetchSearchHistory();
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selecting a search history item
  const handleSelectHistory = (historyQuery) => {
    setQuery(historyQuery);
    setShowDropdown(false);
    // Optionally, you can trigger a search immediately
    // submitJob({ preventDefault: () => {} }, historyQuery);
  };

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <title>Real-Time Reddit Scraper</title>
        <meta name="description" content="Scrape real-time Reddit search results based on your queries." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Top-level container with conditional classes for dark/light mode */}
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
        {/* Header at the top, centered horizontally */}
        <div className="w-full flex justify-center p-4">
          <Header darkMode={darkMode} toggleDarkMode={handleToggleDarkMode} />
        </div>

        {/* Main content area */}
        <div className={`flex-grow flex flex-col items-center ${!(status || tweets.length > 0 || error) ? 'justify-center' : 'justify-start'} px-4`}>
          
          {/* Logo Above Search Bar */}
          <img src="/x-logo.png" alt="Reddit Logo" className="mb-4 w-16 h-16" />

          {/* Search Form */}
          <div className="w-full max-w-md relative">
            <form onSubmit={submitJob} className="flex flex-col items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Reddit..."
                aria-label="Search Reddit"
                required
                onFocus={handleInputFocus}
                className={`w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
              />
              {showDropdown && searchHistory.length > 0 && (
                <div ref={dropdownRef} className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <ul className="max-h-60 overflow-y-auto">
                    {searchHistory.map((historyQuery, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectHistory(historyQuery)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {historyQuery}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </div>

          {/* Status / Error / Loading Spinner */}
          {status && (
            <div className="w-full max-w-md mt-6 text-center">
              <p className="text-lg">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    status === 'completed'
                      ? 'text-green-500'
                      : status === 'failed'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {status.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
          )}

          {error && (
            <div className="w-full max-w-md mt-4 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {status === 'in_progress' && (
            <div className="w-full max-w-md mt-4 flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}

          {/* Results */}
          {tweets && tweets.length > 0 && (
            <div className="w-full max-w-md mt-8 pb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Scraped Posts:</h2>
              <ul className="space-y-4">
                {tweets.map((tweet) => (
                  <TweetCard key={tweet.tweet_id} tweet={tweet} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer at the bottom, centered horizontally */}
        <footer className="w-full flex justify-center pb-4">
          <div className={`${darkMode ? 'text-gray-500' : 'text-gray-700'} text-sm text-center`}>
            © {new Date().getFullYear()} Real-Time Reddit Scraper
          </div>
        </footer>
      </div>
    </>
  );
}
