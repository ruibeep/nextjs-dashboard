import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';

// Export a named function for the POST method
export async function POST(req: Request) {
  try {
    // Parse the request body from the incoming request
    const { text } = (await req.json()) as { text?: string };

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ message: 'Text is required' }),
        { status: 400 }
      );
    }

    // Set up OAuth 1.0a configuration
    const oauth = new OAuth({
      consumer: {
        key: process.env.X_API_KEY || '',
        secret: process.env.X_API_SECRET || '',
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });

    const token = {
      key: process.env.X_ACCESS_TOKEN || '',
      secret: process.env.X_ACCESS_TOKEN_SECRET || '',
    };

    const url = 'https://api.twitter.com/2/tweets';

    const requestData = {
      url,
      method: 'POST',
      // **Do not include body parameters (text) here**
    };

    // Authorize without including body parameters
    const headers = oauth.toHeader(oauth.authorize(requestData, token));

    // **Log the request details for debugging (ensure sensitive data is masked)**
    // console.log('--- Preparing to send request to X API ---');
    // console.log('URL:', url);
    // console.log('Method:', requestData.method);
    // console.log('Headers:', headers);
    // console.log('Request Body:', { text });
    // console.log('--- End of request details ---');

    // Make the POST request to the X API with JSON body
    const response = await axios.post(
      url,
      { text },
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Tweet posted successfully!', data: response.data }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error posting to X:', error.response?.data || error.message);
    return new Response(
      JSON.stringify({ message: 'Failed to post tweet', error: error.response?.data }),
      { status: 500 }
    );
  }
}