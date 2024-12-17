// frontend/pages/index.js
import { useState, useEffect } from 'react';
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
    } catch (err) {
      console.error(err);
      setError('Failed to submit job. Please ensure your backend is running and try again.');
      setStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://real-time-scraper-backend-production.up.railway.app/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch job status');
        }

        const data = await res.json();
        setStatus(data.status);

        // If completed or failed, stop polling and show whatever results we have
        if (data.status === 'completed' || data.status === 'failed') {
          setTweets(data.results);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch job status. Please check your connection.');
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <Head>
        <title>Real-Time Twitter Scraper</title>
        <meta name="description" content="Scrape real-time tweets based on your search queries." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Header at the top, centered horizontally */}
        <div className="w-full flex justify-center p-4">
          <Header darkMode={darkMode} toggleDarkMode={handleToggleDarkMode} />
        </div>

        {/* Main content area - flex-grow to fill space, flex-col and items-center for horizontal center */}
        <div className={`flex-grow flex flex-col items-center ${!(status || tweets.length > 0 || error) ? 'justify-center' : 'justify-start'} px-4`}>
          {/* Search Form */}
          <form onSubmit={submitJob} className="w-full max-w-md flex flex-col items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Twitter..."
              aria-label="Search Twitter"
              required
              className="w-full px-4 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>

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
          {tweets.length > 0 && (
            <div className="w-full max-w-md mt-8 pb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Scraped Tweets:</h2>
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
          <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Real-Time Twitter Scraper
          </div>
        </footer>
      </div>
    </>
  );
}
