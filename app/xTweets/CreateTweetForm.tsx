'use client';

import { useState } from 'react';

interface TweetData {
  id: string;
  text: string;
}

export default function CreateTweetForm() {
  const [tweetText, setTweetText] = useState('');
  const [createdTweet, setCreatedTweet] = useState<TweetData | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCreatedTweet(null);

    const res = await fetch('/api/x/post-tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: tweetText }),
      cache: 'no-store'
    });

    const data = await res.json() as { data?: TweetData; error?: string };
    if (!res.ok || data.error) {
      setError(data.error || 'Failed to create tweet');
    } else if (data.data) {
      setCreatedTweet(data.data);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="What's happening?"
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
        />
        <button type="submit">Post Tweet</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {createdTweet && (
        <p>Successfully tweeted: "{createdTweet.text}" (ID: {createdTweet.id})</p>
      )}
    </div>
  );
}