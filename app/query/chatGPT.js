import { TwitterApi } from 'twitter-api-v2';
import { db } from '@vercel/postgres';
import { formatISO } from 'date-fns';

// Twitter API client initialization
const twitterClient = new TwitterApi({
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessSecret: 'YOUR_ACCESS_SECRET',
});

// Fetch posts scheduled for today
const fetchScheduledPosts = async () => {
  const today = formatISO(new Date(), { representation: 'date' });
  const todayStart = `${today} 00:00:00`;
  const todayEnd = `${today} 23:59:59`;

  const query = `
    SELECT id, text, image_link, platform, published_date 
    FROM posts
    WHERE status = 'scheduled'
      AND published_date BETWEEN $1 AND $2
  `;
  const values = [todayStart, todayEnd];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error.message);
    throw error;
  }
};

// Post a single quote to Twitter
const postToTwitter = async (text, imageLink) => {
  try {
    if (imageLink) {
      // Post with media (requires uploading the media first)
      const mediaId = await twitterClient.v1.uploadMedia(imageLink);
      const response = await twitterClient.v1.tweet(text, { media_ids: mediaId });
      console.log('Successfully posted with image:', response);
      return response;
    } else {
      // Post text-only tweet
      const response = await twitterClient.v2.tweet(text);
      console.log('Successfully posted:', response);
      return response;
    }
  } catch (error) {
    console.error(`Error posting to Twitter: ${error.message}`);
    throw error;
  }
};

// Update post status after successful publishing
const updatePostStatus = async (postId) => {
  const query = `
    UPDATE posts
    SET status = 'published'
    WHERE id = $1
  `;
  const values = [postId];

  try {
    await db.query(query, values);
    console.log(`Post ID ${postId} marked as published.`);
  } catch (error) {
    console.error(`Error updating post status for ID ${postId}:`, error.message);
  }
};

// Main function to handle scheduled posts for today
const postScheduledQuotes = async () => {
  try {
    console.log('Fetching scheduled posts...');
    const scheduledPosts = await fetchScheduledPosts();

    if (!scheduledPosts.length) {
      console.log('No posts scheduled for today.');
      return;
    }

    console.log(`Found ${scheduledPosts.length} posts for today. Posting...`);

    for (const post of scheduledPosts) {
      try {
        await postToTwitter(post.text, post.image_link);
        await updatePostStatus(post.id);
        console.log(`Post ID ${post.id} published successfully.`);
      } catch (error) {
        console.error(`Failed to publish post ID ${post.id}:`, error.message);
      }
    }

    console.log('All posts scheduled for today have been processed.');
  } catch (error) {
    console.error('Error processing scheduled posts:', error.message);
  }
};

// Execute the function
postScheduledQuotes();

//////////////////////////////////////////////////////////////////


import { TwitterApi } from 'twitter-api-v2';
import { db } from '@vercel/postgres';
import { formatISO } from 'date-fns';

// Define types for posts
interface Post {
  id: number;
  text: string;
  image_link?: string | null;
  platform?: string;
  published_date: Date;
}

// Twitter API client initialization
const twitterClient = new TwitterApi({
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessSecret: 'YOUR_ACCESS_SECRET',
});

// Fetch posts scheduled for today
const fetchScheduledPosts = async (): Promise<Post[]> => {
  const today: string = formatISO(new Date(), { representation: 'date' });
  const todayStart: string = `${today} 00:00:00`;
  const todayEnd: string = `${today} 23:59:59`;

  const query = `
    SELECT id, text, image_link, platform, published_date 
    FROM posts
    WHERE status = 'scheduled'
      AND published_date BETWEEN $1 AND $2
  `;
  const values = [todayStart, todayEnd];

  try {
    const { rows } = await db.query<Post>(query, values);
    return rows;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    throw error;
  }
};

// Post a single quote to Twitter
const postToTwitter = async (text: string, imageLink?: string | null): Promise<void> => {
  try {
    if (imageLink) {
      // Post with media (requires uploading the media first)
      const mediaId = await twitterClient.v1.uploadMedia(imageLink);
      const response = await twitterClient.v1.tweet(text, { media_ids: mediaId });
      console.log('Successfully posted with image:', response);
    } else {
      // Post text-only tweet
      const response = await twitterClient.v2.tweet(text);
      console.log('Successfully posted:', response);
    }
  } catch (error) {
    console.error(`Error posting to Twitter: ${error}`);
    throw error;
  }
};

// Update post status after successful publishing
const updatePostStatus = async (postId: number): Promise<void> => {
  const query = `
    UPDATE posts
    SET status = 'published'
    WHERE id = $1
  `;
  const values = [postId];

  try {
    await db.query(query, values);
    console.log(`Post ID ${postId} marked as published.`);
  } catch (error) {
    console.error(`Error updating post status for ID ${postId}:`, error);
    throw error;
  }
};

// Main function to handle scheduled posts for today
const postScheduledQuotes = async (): Promise<void> => {
  try {
    console.log('Fetching scheduled posts...');
    const scheduledPosts: Post[] = await fetchScheduledPosts();

    if (scheduledPosts.length === 0) {
      console.log('No posts scheduled for today.');
      return;
    }

    console.log(`Found ${scheduledPosts.length} posts for today. Posting...`);

    for (const post of scheduledPosts) {
      try {
        await postToTwitter(post.text, post.image_link);
        await updatePostStatus(post.id);
        console.log(`Post ID ${post.id} published successfully.`);
      } catch (error) {
        console.error(`Failed to publish post ID ${post.id}:`, error);
      }
    }

    console.log('All posts scheduled for today have been processed.');
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
  }
};

// Execute the function
postScheduledQuotes();