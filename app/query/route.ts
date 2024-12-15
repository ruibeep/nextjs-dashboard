import { db } from "@vercel/postgres";

const client = await db.connect();

async function listQuotes() {
  // Choose quotes from books with the fewest published quotes.
  // Within each book, the most popular quotes are chosen.
	const data = await client.sql`
    SELECT q.*
    FROM Quotes q
    LEFT JOIN Posts p ON q.id = p.quote_id AND p.status != 'deleted' AND p.platform = 'X'
    WHERE p.id IS NULL
    ORDER BY (
        SELECT COUNT(p2.id) 
        FROM Quotes q2
        LEFT JOIN Posts p2 ON q2.id = p2.quote_id AND p2.status != 'deleted' AND p2.platform = 'X'
        WHERE q2.book_id = q.book_id
    ) ASC, 
    q.popularity DESC
    LIMIT 10;
  `;

	return data.rows;
}

async function listInvoices() {
	const data = await client.sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data.rows;
}

export async function GET() {
  try {
  	return Response.json(await listQuotes());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
