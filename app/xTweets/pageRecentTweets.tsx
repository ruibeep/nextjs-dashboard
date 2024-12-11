export const runtime = 'nodejs';

interface Tweet {
  id: string;
  text: string;
}

interface XApiErrorResponse {
    data?: Tweet[];
    error?: string;
    stack?: string; // Add this line to reflect the new field
  }

export default async function XTweetsPage() {
  // Server-side fetch: calling our internal API route
  const res = await fetch('http://localhost:3000/api/x/recent?query=public%20domain%20authors', {
    cache: 'no-store',
  });


  const data = await res.json() as XApiErrorResponse;
  const tweets = data.data || [];
  if (data.error) {
    console.error('Full Error Message:', data.error);
    // console.error('Stack Trace:', data.stack);
  }

  return (
    <main>
      <h1>Recent Tweets about Public Domain Authors</h1>
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet.id}>{tweet.text}</li>
          ))}
        </ul>
      ) : (
        <p>No recent tweets found.</p>
      )}
      <hr />
      {/* Include a client component for dynamic searching */}
      <ClientSearch />
    </main>
  );
}

// Import the ClientSearch component at the bottom
import ClientSearch from './ClientSearch';