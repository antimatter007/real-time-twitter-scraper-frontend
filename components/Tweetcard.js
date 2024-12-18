// frontend/components/Tweetcard.js
export default function TweetCard({ tweet }) {
  return (
    <li className="p-4 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-md">
      <p className="mb-2 text-lg">{tweet.tweet_text}</p>
      <div className="flex justify-between items-center text-sm text-gray-400 dark:text-gray-300">
        <span>@{tweet.author_handle}</span>
        <span>{new Date(tweet.timestamp).toLocaleString()}</span>
      </div>
    </li>
  );
}
