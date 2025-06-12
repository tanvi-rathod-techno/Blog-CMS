// app/post/[id]/page.tsx
'use client';

import { notFound, useRouter } from 'next/navigation';
import { fetchPostById } from '@/app/lib/api/postStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isLocalPost, setIsLocalPost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id;
        const stored = JSON.parse(localStorage.getItem('localPosts') || '[]');
        const local = stored.find((p: any) => p.id.toString() === id);

        if (local) {
          setPost(local);
          setIsLocalPost(true);
        } else {
          const remote = await fetchPostById(id);
          setPost(remote);
        }
      } catch (err) {
        notFound();
      }
    };

    fetchData();
  }, [params.id]);

  const handleDelete = () => {
    if (!post) return;

    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    if (isLocalPost) {
      const stored = JSON.parse(localStorage.getItem('localPosts') || '[]');
      const updated = stored.filter((p: any) => p.id !== post.id);
      localStorage.setItem('localPosts', JSON.stringify(updated));
      router.push('/');
    } else {
      fetch(`/api/posts/${post.id}`, { method: 'DELETE' }).then(() => router.push('/'));
    }
  };

  if (!post) {
    return <div className="text-center py-10">Loading post...</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-6 flex justify-end">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>

      {/* Edit / Delete Buttons (only for local posts) */}
      {isLocalPost && (
        <div className="mb-4 flex justify-end gap-4">
          <Link
            href={`/edit/${post.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

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
        Posted on{' '}
        <span className="font-medium">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : 'June 11, 2025'}
        </span>{' '}
        · Author: <span className="italic">Demo User</span>
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
