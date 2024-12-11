'use client';

import { useState } from 'react';

interface Tweet {
  id: string;
  text: string;
}

export default function ClientSearch() {
  const [query, setQuery] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);

  async function handleSearch() {
    const res = await fetch(`/api/x/recent?query=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });
    const data = await res.json() as { data?: Tweet[]; error?: string };
    setTweets(data.data || []);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search tweets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet) => <li key={tweet.id}>{tweet.text}</li>)}
        </ul>
      ) : (
        <p>No tweets to display. Try searching another term.</p>
      )}
    </div>
  );
}