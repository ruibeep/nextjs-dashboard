const snoowrap = require('snoowrap');
const { NextResponse } = require('next/server');

/**
 * Submits a link to Reddit with a specified flair.
 *
 * @param {snoowrap} redditClient - Snoowrap instance for Reddit API access.
 * @param {string} subreddit - The subreddit to post in.
 * @param {string} title - The title of the post.
 * @param {string} url - The URL to submit.
 * @param {string} flairId - The flair template ID to apply.
 * @param {string} flairText - Optional flair text (if allowed by the subreddit).
 * @returns {Promise<object|null>} A Promise resolving to the submission object or null if submission fails.
 */
async function submitLinkWithFlair(redditClient, subreddit, title, url, flairId, flairText) {
  try {
    const subredditObj = redditClient.getSubreddit(subreddit);

    // Prepare the options for the submission
    const options : any = {
      title: title,
      url: url,
      resubmit: false,
    };
    
    if (flairId) options.flairId = flairId;
    if (flairText) options.flairText = flairText;
    // Submit the link with flair
    const mySubmission = await subredditObj.submitLink(options);

    console.log(`Post submitted successfully: ${mySubmission.url}`);
    return mySubmission;
  } catch (error) {
    console.error('Error submitting post with flair:', error);
    return null;
  }
}

/**
 * Handles a GET request in a Next.js API route.
 *
 * Example usage:
 * - Calls `submitLinkWithFlair` to submit a post to Reddit and returns the result.
 */
export async function GET() {
  const redditClient = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT || '',
    clientId: process.env.REDDIT_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
    username: process.env.REDDIT_USERNAME || '',
    password: process.env.REDDIT_PASSWORD || '',
  });

  const subreddit = 'FreeEBOOKS';
  const linkTitle = 'A Tale of Two Cities by Charles Dickens';
  const linkUrl = 'https://publicdomainlibrary.org/en/books/a-tale-of-two-cities';
  const flairId = 'a0931564-ffaf-11e2-9318-12313b0cf20e'; // Replace with the correct flair template ID for the subreddit

  try {
    const submission = await submitLinkWithFlair(
      redditClient,
      subreddit,
      linkTitle,
      linkUrl,
      flairId,
      ''
    );

    if (submission) {
      return NextResponse.json({
        success: true,
        message: 'Post submitted successfully!',
        submissionUrl: submission.url,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to submit the post.',
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}