// components/TweetCard.js

import React from 'react';

const TweetCard = ({ tweet }) => {
  return (
    <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{tweet.tweet_text}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Posted by <span className="font-medium">@{tweet.author_handle}</span> on{' '}
        {new Date(tweet.timestamp).toLocaleString()}
      </p>
    </li>
  );
};

export default TweetCard;
