import { db } from "@vercel/postgres";
import { formatISO, addDays, startOfDay, endOfDay} from 'date-fns';
import { TwitterApi } from 'twitter-api-v2';

const client = await db.connect();


// Initialize Twitter client with OAuth 1.0a credentials
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY?.trim() || '',
  appSecret: process.env.X_KEY_SECRET?.trim() || '',
  accessToken: process.env.X_ACCESS_TOKEN?.trim() || '',
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET?.trim() || '',
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
  console.log(`FetchScheduledPosts: Query ${query}, Values: "${values}".`);


  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error.message);
    throw error;
  }
};

async function schedulePostForTomorrow() {
  // Step 1: Get tomorrow's date 
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // Get the start and end of tomorrow
  const tomorrowStart = formatISO(startOfDay(tomorrow), { representation: 'date' });
  const tomorrowEnd = formatISO(endOfDay(tomorrow), { representation: 'date' });

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


  // Step 3: Fetch the next quote to publish
  const quoteToPostResult = await client.sql`
    WITH posted_quotes AS (
      SELECT DISTINCT quote_id
      FROM posts
      WHERE status IN ('published', 'scheduled')
    ),
    book_priority AS (
      SELECT
        b.id AS book_id,
        COUNT(p.id) AS posted_count
      FROM books b
      LEFT JOIN posts p ON p.book_id = b.id
      GROUP BY b.id
      ORDER BY posted_count ASC
    )
    SELECT
      q.id AS quote_id,
      q.quote AS quote,
      b.id AS book_id,
      b.title AS book_title,
      a.name AS author_name,
      q.popularity
    FROM quotes q
    INNER JOIN books b ON q.book_id = b.id
    INNER JOIN authors a ON b.author_id = a.id
    LEFT JOIN posted_quotes pq ON q.id = pq.quote_id
    INNER JOIN book_priority bp ON b.id = bp.book_id
    WHERE pq.quote_id IS NULL
    ORDER BY bp.posted_count ASC, q.popularity DESC
    LIMIT 1; -- Fetch only one quote
  `;

  const quoteToPost = quoteToPostResult.rows; // Extract the rows array

  if (quoteToPost.length === 0) {
    console.log('No quotes available to schedule. Aborting...');
    return [];
  }
  
  const item = quoteToPost[0]; // Access the first item in the rows array
  // Step 4: Build the post text dynamically with the full book title
  const postText = `"${item.quote}" - ${item.book_title} by ${item.author_name}`;
  // Step 5: Insert the new post for tomorrow
  const data = await client.sql`
    INSERT INTO posts (quote_id, text, platform, status, published_date)
    VALUES (
      ${item.quote_id},
      ${postText},
      'X',
      'scheduled',
      ${tomorrowStart}
    );
  `;

  console.log(`Scheduled 1 post for tomorrow: Quote ID ${item.quote_id}, Text: "${postText}".`);
  return data.rows; 
}

// Post a single quote to Twitter
const postToTwitter = async (text:string, imageLink?: string | null) => {
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
    if (error instanceof Error) {
      console.error('Error fetching scheduled posts:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error; // Re-throw the error after logging
  }
};


export async function GET() {
  try {
    //return Response.json(await fetchScheduledPosts());
    return Response.json(await postToTwitter('10:37: hello world!', ''));
  	//return Response.json(await schedulePostForTomorrow());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
