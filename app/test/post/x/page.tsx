'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResponseMessage(null);

    try {
      const res = await fetch('/api/x/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage(data.message);
        setText(''); // Clear the textarea upon success
      } else {
        setErrorMessage(data.message || 'Failed to post tweet.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Post a Tweet to X</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening??"
          rows={4}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          required
          maxLength={280} // X's maximum tweet length
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#1DA1F2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Posting...' : 'Tweet'}
        </button>
      </form>
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}