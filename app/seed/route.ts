import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const client = await db.connect();

async function seedAuthors() {
  // await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS authors (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      born DATE,
      death DATE,
      description TEXT,
      link TEXT
    );
  `;

  return client.sql`
    INSERT INTO authors (name, image, born, death, description, link)
    VALUES (
      'Mark Twain',
      'https://publicdomainlibrary.org/uploads/attachments/floj4mxxqyi1ncjflxiu0rkt-marktwain-loc.max.webp',
      '1835-11-30',
      '1910-04-21',
      'Mark Twain was an American writer, humorist, entrepreneur, publisher, and lecturer.',
      'https://publicdomainlibrary.org/en/authors/mark-twain'
    );
  `;
}


async function seedBooks() {
  // await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      cover TEXT,
      title TEXT NOT NULL,
      files TEXT,
      language TEXT,
      link TEXT,
      author_id INT NOT NULL,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
    );
  `;

  return client.sql`
    INSERT INTO books (cover, title, files, language, link, author_id)
    VALUES (
      'https://publicdomainlibrary.org/uploads/attachments/hfwxzm491ppzdnih8jxtc78d-pdl-covers-the-adventures-of-huckleberry-finn.one-half.webp',
      'The Adventures of Huckleberry Finn',
      'https://publicdomainlibrary.org/uploads/attachments/j1h7f8zakusf7cm6knxws6cw-0009-the-adventures-of-huckleberry-finn-mark-twain.epub',
      'English',
      'https://publicdomainlibrary.org/en/books/the-adventures-of-huckleberry-finn',
      1
    );
  `;
}

async function seedQuotes() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      quote TEXT NOT NULL,
      popularity INT,
      book_id INT NOT NULL,
      size INT GENERATED ALWAYS AS (length(quote)) STORED,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );
  `;

  return client.sql`
    INSERT INTO quotes (quote, popularity, book_id)
    VALUES (
      '“All right, then, I''ll go to hell.”',
      671,
      1
    );
  `;
}


async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedQuotes();
    // await seedAuthors();
    // await seedBooks();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

/*
export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
*/