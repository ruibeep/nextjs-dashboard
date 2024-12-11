import crypto from 'crypto';
import oauth1a from 'oauth-1.0a';

const BASE_URL = 'https://api.twitter.com/2';

const consumerKey = process.env.X_API_KEY!;
const consumerSecret = process.env.X_KEY_SECRET!;
const accessToken = process.env.X_ACCESS_TOKEN!;
const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET!;

const oauth = new oauth1a({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

export async function postTweet(text: string) {
  const endpoint = `${BASE_URL}/tweets`;

  const requestData = {
    url: endpoint,
    method: 'POST',
    data: { text }
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(requestData, { key: accessToken, secret: accessTokenSecret })
  );

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text }),
    // no-store ensures no caching to avoid stale results
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`X API POST error: ${JSON.stringify(errorData)}`);
  }

  return res.json();
}