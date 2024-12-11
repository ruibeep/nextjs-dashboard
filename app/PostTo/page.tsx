'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResponseMessage(null);

    try {
      const res = await fetch('/api/x/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMessage(data.message);
      } else {
        setErrorMessage(data.message || 'Failed to post tweet');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Post to X</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your tweet here..."
          rows={4}
          cols={50}
          style={{ width: '100%', padding: '0.5rem' }}
          required
          maxLength={280}
        />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}