'use client';
import { ArrowLeft } from 'lucide-react';

import { notFound, useRouter } from 'next/navigation';
import { fetchPostById } from '@/app/lib/api/postStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CommentSection from '@/app/components/comments/CommentsSection';

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
        <Link href="/" className="text-blue-900 hover:underline">
        <ArrowLeft className="w-5 h-5 mr-1" />
        </Link>
      </div>

     

      {/* Post Image */}
     

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
      <div className="mb-6">
        <img
          src={`https://picsum.photos/seed/${post.id}/800/400`}
          alt="Blog cover"
          className="w-full h-auto rounded-xl object-cover shadow"
        />
      </div>
      {/* Body */}
      <article className="prose prose-lg text-gray-800 max-w-none">
        <p>{post.body}</p>
      </article>

      <CommentSection postId={Number(params.id)} />
    </main>
  );
}
