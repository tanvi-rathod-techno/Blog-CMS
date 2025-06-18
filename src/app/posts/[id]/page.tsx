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
  image?: string; // Optional if saved
};

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(''); // hold image path
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id?.toString();
        if (!id) return notFound();

        const stored: Post[] = JSON.parse(localStorage.getItem('localPosts') || '[]');
        const local = stored.find(p => p.id.toString() === id);

        let postToSet: Post;

        if (local) {
          postToSet = local;
        } else {
          postToSet = await fetchPostById(id);
        }

        // Set image from localStorage if available
        const imageMap = JSON.parse(localStorage.getItem('postImages') || '{}');
        const localImage = imageMap[postToSet.id];

        if (localImage) {
          setImageUrl(`/${localImage}`); // from /public or file path
        } else {
          setImageUrl(`https://picsum.photos/seed/${postToSet.id}/600/400`);
        }

        setPost(postToSet);
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
      {imageUrl && (
        <div className="mb-6">
          <Image
            src={imageUrl}
            alt="Post image"
            width={600}
            height={400}
            unoptimized
          />
        </div>
      )}

      {/* Body */}
      <article className="prose prose-lg text-gray-800 max-w-none">
        <p>{post.body}</p>
      </article>

      <CommentSection postId={post.id} />
    </main>
  );
}
