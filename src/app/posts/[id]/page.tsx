'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { fetchPostById } from '@/app/lib/api/postStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CommentSection from '@/app/components/comments/CommentsSection';

type Post = {
  id: number;
  title: string;
  body: string;
  createdAt?: string;
};

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id?.toString(); // use optional chaining to be safe
        if (!id) return notFound();

        const stored: Post[] = JSON.parse(localStorage.getItem('localPosts') || '[]');
        const local = stored.find(p => p.id.toString() === id);

        if (local) {
          setPost(local);
        } else {
          const remote = await fetchPostById(id);
          setPost(remote);
        }
      } catch {
        notFound();
      }
    };

    fetchData();
  }, [params.id]);

  if (!post) {
    return <div className="text-center py-10">Loading post...</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-6 flex justify-end">
        <Link href="/" className="text-blue-900 hover:underline flex items-center">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
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

      {/* Post Image */}
      <div className="mb-6">
        <Image
          src={`https://picsum.photos/seed/${post.id}/600/400`}
          alt="Post image"
          width={600}
          height={400}
          unoptimized
        />
      </div>

      {/* Body */}
      <article className="prose prose-lg text-gray-800 max-w-none">
        <p>{post.body}</p>
      </article>

      <CommentSection postId={post.id} />
    </main>
  );
}
