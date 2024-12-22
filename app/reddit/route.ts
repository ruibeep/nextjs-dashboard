import snoowrap, { Submission } from 'snoowrap';
import { NextResponse } from 'next/server';

// Initialize snoowrap with trimmed environment variables
const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT?.trim() || '',
  clientId: process.env.REDDIT_CLIENT_ID?.trim() || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET?.trim() || '',
  username: process.env.REDDIT_USERNAME?.trim() || '',
  password: process.env.REDDIT_PASSWORD?.trim() || '',
});

// Function to fetch and return top 10 hot posts from a subreddit
const fetchHotPosts = async (subreddit: string, limit: number = 10): Promise<Submission[]> => {
  try {
    const subredditInstance = r.getSubreddit(subreddit);
    const posts: Submission[] = await subredditInstance.getHot({ limit });
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Rethrow to handle it in the caller
  }
};

// Function to submit a link with flair
async function submitLinkWithFlair(
  subreddit: string,
  title: string,
  url: string,
  flairId?: string,
  flairText?: string
): Promise<Submission | null> {
  try {
    const subredditObj = r.getSubreddit(subreddit);

    const submissionOptions: snoowrap.SubmitLinkOptions = {
      title: title,
      url: url,
    };

    if (flairId || flairText) {
      submissionOptions.flair = {};
      if (flairId) {
        submissionOptions.flair_id = flairId;
        console.log(`Used flairId: ${flairId}`);
      }
      if (flairText) {
        submissionOptions.flair_text = flairText;
        console.log(`Used flairText: ${flairText}`);
      }
    }

    const post: Submission = await subredditObj.submitLink(submissionOptions);
    console.log(`Post submitted successfully: ${post.url}`);
    return post;
  } catch (error: any) { // Type as any to access error.message
    console.error('Error submitting post:', error);
    // Optionally, handle specific Reddit API errors
    if (error.message.includes('SUBMIT_VALIDATION_FLAIR_REQUIRED')) {
      console.error('Flair is required but was not set correctly.');
    }
    return null;
  }
}

export async function GET() {
  // Define the post details
  const postTitle = 'A Tale of Two Cities by Charles Dickens';
  const postUrl = 'https://publicdomainlibrary.org/en/books/a-tale-of-two-cities';
  const flairText = 'Classic';
  const flairId = "a0931564-ffaf-11e2-9318-12313b0cf20e"; // Ensure this is set correctly

  try {
    // Submit the link with flair and capture the returned Submission object
    const submittedPost = await submitLinkWithFlair(
      'FreeEBOOKS',
      postTitle,
      postUrl,
      flairId  //undefined //Pass the flairId
    );

    if (submittedPost) {
      return NextResponse.json({
        message: 'Post submitted successfully!',
        postUrl: submittedPost.url,
      });
    } else {
      return NextResponse.json({ error: 'Failed to submit the post.' }, { status: 500 });
    }
  } catch (error) {
    console.error('GET /reddit error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}