// app/post/[id]/page.tsx or similar
import { notFound } from 'next/navigation';
import { fetchPostById } from '@/app/lib/api/postStore';
import Link from 'next/link';


export default async function PostDetail({ params }: { params: { id: string } }) {
  let post;

  try {
    post = await fetchPostById(params.id);
  } catch {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-6 flex justify-end">
    <Link href="/" className="text-blue-600 hover:underline">Back to Home </Link>
  </div>

      {/* Post Image */}
      <div className="mb-6">
        <img
          src={`https://picsum.photos/seed/${post.id}/800/400`}
          alt="Blog cover"
          className="w-full h-auto rounded-xl object-cover shadow"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>

      {/* Meta */}
      <p className="text-sm text-gray-500 mb-8">
        Posted on <span className="font-medium">June 11, 2025</span> · Author:{' '}
        <span className="italic">Demo User</span>
      </p>

      {/* Body */}
      <article className="prose prose-lg text-gray-800 max-w-none">
        <p>{post.body}</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique, nunc nec
          elementum feugiat, justo velit sagittis eros, non facilisis nisi nunc ac lorem. Nulla
          facilisi.
        </p>
        <p>
          Ut a lacinia velit. In hac habitasse platea dictumst. Suspendisse potenti. Curabitur nec
          libero sit amet quam feugiat pulvinar at in sapien.
        </p>
      </article>
    </main>
  );
}
