import CreateTweetForm from './CreateTweetForm'; // Import the client component

export default async function XTweetsPage() {
  return (
    <main>
      <h1>Post a New Tweet</h1>
      {/* Render the client component directly in a server component */}
      <CreateTweetForm />
    </main>
  );
}