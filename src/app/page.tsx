import PostsList from '@/app/components/posts/PostList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-6 py-10">
        <PostsList />
      </main>
    </div>
  );
}
         