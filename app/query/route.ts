import { db } from "@vercel/postgres";

const client = await db.connect();


async function schedulePostForTomorrow() {
  // Step 1: Get tomorrow's date 
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Format tomorrow's start and end times for PostgreSQL
  const tomorrowStart = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')} 00:00:00`;
  const tomorrowEnd = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')} 23:59:59`;

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


export async function GET() {
  try {
  	return Response.json(await schedulePostForTomorrow());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
