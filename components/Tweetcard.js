// frontend/components/Tweetcard.js

export default function TweetCard({ tweet, darkMode }) {
  return (
    <li
      className={`p-4 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
      } rounded-lg shadow-md transition-colors duration-300`}
    >
      <p className="mb-2 text-lg">{tweet.tweet_text}</p>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>@{tweet.author_handle}</span>
        <span>{new Date(tweet.timestamp).toLocaleString()}</span>
      </div>
    </li>
  );
}
