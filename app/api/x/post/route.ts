
import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Initialize Twitter client with OAuth 1.0a credentials
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY?.trim() || '',
  appSecret: process.env.X_KEY_SECRET?.trim() || '',
  accessToken: process.env.X_ACCESS_TOKEN?.trim() || '',
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET?.trim() || '',
});

console.log('Never makes it here!');


// Get the read-write client
const rwClient = twitterClient.readWrite;

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const { text } = (await request.json()) as { text?: string };

    // Validate the 'text' parameter
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { message: 'Text is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // Post the tweet using the Twitter client (API v2)
    const tweet = await rwClient.v2.tweet(text);

    // Respond with success
    return NextResponse.json(
      { message: 'Tweet posted successfully!', data: tweet },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error posting to X:', error);

    // Handle specific Twitter API errors
    if (error.code === 89) { // Invalid or expired token
      return NextResponse.json(
        { message: 'Invalid or expired token.', error: error },
        { status: 401 }
      );
    }

    // General server error
    return NextResponse.json(
      { message: 'Failed to post tweet.', error: error },
      { status: 500 }
    );
  }
}