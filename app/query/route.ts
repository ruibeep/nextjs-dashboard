import { db } from "@vercel/postgres";
import type { NextRequest } from 'next/server'
import { formatISO, addDays, startOfDay, endOfDay} from 'date-fns';
import { TwitterApi } from 'twitter-api-v2';

// Todo: connection to the database should be requested only after checking CRON_SECRET
const client = await db.connect();

// Initialize Twitter client with OAuth 1.0a credentials
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY?.trim() || '',
  appSecret: process.env.X_KEY_SECRET?.trim() || '',
  accessToken: process.env.X_ACCESS_TOKEN?.trim() || '',
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET?.trim() || '',
});

// Fetch posts scheduled for today 
async function fetchScheduledPosts() {
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
  console.log(`FetchScheduledPosts: Query ${query}, Values: "${values}".`);


  try {
    console.log('Going to run query');
    const result = await db.query(query, values); // There is a problem here
    console.log('Going to return results');
    return result.rows;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching scheduled posts for Today:', error.message);
    } else {
      console.error('Unkown error fetching scheduled posts for Today:', error);
    }
    throw error; // Re-throw the error after logging
  }
}

// Writes a new post to the database
  // Step 1: Get tomorrow's date 
  // Step 2: Check if there are already posts for tomorrow
  // Step 3: Fetch the next quote to publish
  // Step 4: Build the post text dynamically with the full book title  
  // Step 5: Insert the new post for tomorrow
async function schedulePostForTomorrow() {
  // Step 1: Get tomorrow's date 
  const today = new Date();
  const tomorrow = formatISO(addDays(today, 1), { representation: 'date' });
  const tomorrowStart = `${tomorrow} 00:00:00`;
  const tomorrowEnd = `${tomorrow} 23:59:59`;

  // Step 2: Check if there are already posts for tomorrow
  const existingPosts = await client.sql`
    SELECT 1
    FROM posts
    WHERE published_date >= ${tomorrowStart}::timestamp
      AND published_date < ${tomorrowEnd}::timestamp;
  `;


  if (existingPosts.rows.length > 0) {
    console.log('A post for tomorrow already exists. Aborting...');
    return [];
  }


  console.log('Fetch the next quote to publish...');
  // Step 3: Fetch the next quote to publish
  // Used ChatGPT for creating this SQL query.
  // https://chatgpt.com/share/677d0a6c-a840-8010-8815-5ad1b9226577
  const quoteToPostResult = await client.sql`
    WITH book_quote_counts AS (
      SELECT
        b.id AS book_id,
        b.title AS book_title,
        b.cover AS book_cover,
        a.name AS author_name,
        COUNT(p.id) AS book_post_count
      FROM
        books b
        JOIN authors a ON b.author_id = a.id
        LEFT JOIN quotes q ON b.id = q.book_id
        LEFT JOIN posts p ON q.id = p.quote_id
      GROUP BY
        b.id, b.title, b.cover, a.name
    ),
    quote_post_counts AS (
      SELECT
        q.id AS quote_id,
        q.quote,
        q.popularity,
        q.book_id,
        COUNT(p.id) AS quote_post_count
      FROM
        quotes q
        LEFT JOIN posts p ON q.id = p.quote_id
      GROUP BY
        q.id, q.quote, q.popularity, q.book_id
    ),
    filtered_books AS (
      SELECT
        bq.book_id,
        bq.book_title,
        bq.book_cover,
        bq.author_name,
        MIN(qpc.quote_post_count) AS min_quote_post_count,
        bq.book_post_count
      FROM
        book_quote_counts bq
        JOIN quote_post_counts qpc ON bq.book_id = qpc.book_id
      GROUP BY
        bq.book_id, bq.book_title, bq.book_cover, bq.author_name, bq.book_post_count
      ORDER BY
        bq.book_post_count ASC
    ),
    final_quotes AS (
      SELECT
        qpc.quote_id,
        qpc.quote,
        qpc.book_id,
        fb.book_title,
        fb.book_cover,
        fb.author_name,
        qpc.popularity
      FROM
        filtered_books fb
        JOIN quote_post_counts qpc ON fb.book_id = qpc.book_id
      WHERE
        qpc.quote_post_count = fb.min_quote_post_count
      ORDER BY
        fb.book_post_count ASC,
        qpc.quote_post_count ASC,
        qpc.popularity DESC
    )
    SELECT
      quote_id,
      quote,
      book_id,
      book_title,
      book_cover,
      author_name,
      popularity
    FROM
      final_quotes
    LIMIT 1;
  `;
  console.log('Query executed');

  
  const quoteToPost = quoteToPostResult.rows; // Extract the rows array

  if (quoteToPost.length === 0) {
    console.log('No quotes available to schedule. Aborting...');
    return [];
  }
  
  const item = quoteToPost[0]; // Access the first item in the rows array
  // Step 4: Build the post text dynamically with the full book title
  const postText = `"${item.quote}" - ${item.book_title} by ${item.author_name} #ebooks #mustread #booklovers #book #ReadersCommunity #bookrecommendations #kindlebooks #ClassicLitMonday #BookologyThursday`;
  
  // Step 5: Insert the new post for tomorrow
  const data = await client.sql`
    INSERT INTO posts (quote_id, text, image_link, platform, status, published_date)
    VALUES (
      ${item.quote_id},
      ${postText},
      ${item.book_cover},
      'X',
      'scheduled',
      ${tomorrowStart}
    );
  `;

  console.log(`Scheduled 1 post for tomorrow: Quote ID ${item.quote_id}, Text: "${postText}".`);
  return data.rows; 
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// Post a single quote to Twitter
async function postToTwitter(text:string, imageLink?: string | null) {
  try {
    if (imageLink) {
      console.log('Downloading image...');
      const imageBuffer = await downloadImage(imageLink);

      console.log('Uploading image to Twitter...');
      const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: 'image/jpeg' });

      // Post with media
      console.log('Making the post...');
      // const response = await twitterClient.v2.tweet(text, { media_ids: [mediaId] });
      const response = await twitterClient.v2.tweet({text: text, media:{ media_ids: [mediaId] }});


      console.log('Successfully posted with image:', response);
      return response;
    } else {
      // Post text-only tweet
      const response = await twitterClient.v2.tweet(text);
      console.log('Successfully posted:', response);
      return response;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching scheduled posts:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error; // Re-throw the error after logging
  }
}

// Update post status after successful publishing
async function updatePostStatus(postId:number) {
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
    if (error instanceof Error) {
      console.error(`Error updating post status for ID ${postId}:`, error.message);        
    } else {
      console.error(`Unpextected Error updating post status for ID ${postId}:`, error);
    }
    throw error; // Re-throw the error after logging         

  }
}

// Main function to handle scheduled posts for today
async function postScheduledQuotes() {
  try {
    console.log('Fetching scheduled posts...');
    const scheduledPosts = await fetchScheduledPosts();
    console.log('Fetch scheduled posts done.');

    if (!scheduledPosts.length) {
      console.error('No posts scheduled for today.');
    }

    console.log(`Found ${scheduledPosts.length} posts for today. Posting...`);

    for (const post of scheduledPosts) {
      try {
        await postToTwitter(post.text, post.image_link);
        await updatePostStatus(post.id);
        console.log(`Post ID ${post.id} published successfully.`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to publish post ID ${post.id}:`, error.message);
        } else {
          console.error(`Unpextected error while publishing post ID ${post.id}:`, error);
        }
        throw error; // Re-throw the error after logging         
      }
    }

    console.log('All posts scheduled for today have been processed.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing scheduled posts:', error.message);
    } else {
      console.error('An unexpected error processing scheduled posts::', error);
    }
    throw error; // Re-throw the error after logging 
  }
}

export async function GET(request: NextRequest) {  
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    console.log('Starting postScheduledQuotes...');
    const scheduledQuotesResult = await postScheduledQuotes();
    console.log('postScheduledQuotes completed.');

    console.log('Starting schedulePostForTomorrow...');
    const scheduleTomorrowResult = await schedulePostForTomorrow();
    console.log('schedulePostForTomorrow completed.');

    return Response.json({
      success: true,
      message: 'Both functions executed sequentially.',
      results: {
        scheduledQuotesResult,
        scheduleTomorrowResult,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error executing functions:', error.message);
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error occurred:', error);
      return Response.json(
        { success: false, message: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}