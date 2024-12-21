import snoowrap, { Submission } from 'snoowrap';


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

// Example usage (for testing purposes)
fetchHotPosts('javascript')
  .then((posts) => {
    posts.forEach((post) => {
      console.log(`${post.title} (${post.score} points)`);
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });

export async function GET() {
  try {
    const posts = await fetchHotPosts('javascript');
    // Map the posts to a simpler format if needed
    const formattedPosts = posts.map((post) => ({
      title: post.title,
      score: post.score,
      url: post.url,
    }));
    return new Response(JSON.stringify({ posts: formattedPosts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts.' }), { status: 500 });
  }
}


/*
// Function to validate that all required environment variables are provided
const validateEnvVariables = (): void => {
  const missingVars: string[] = [];

  if (!REDDIT_USER_AGENT?.trim()) missingVars.push('REDDIT_USER_AGENT');
  if (!REDDIT_CLIENT_ID?.trim()) missingVars.push('REDDIT_CLIENT_ID');
  if (!REDDIT_CLIENT_SECRET?.trim()) missingVars.push('REDDIT_CLIENT_SECRET');
  if (!REDDIT_USERNAME?.trim()) missingVars.push('REDDIT_USERNAME');
  if (!REDDIT_PASSWORD?.trim()) missingVars.push('REDDIT_PASSWORD');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing the following environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Validate environment variables before proceeding
validateEnvVariables();
*/