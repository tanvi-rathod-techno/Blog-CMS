'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
  image?: string;
};

export default function PostCard({ post }: { post: Post }) {
  const [storedImage, setStoredImage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedImages = JSON.parse(localStorage.getItem('postImages') || '{}');
      if (storedImages[post.id]) {
        setStoredImage(`/${storedImages[post.id]}`);
      }
    }
  }, [post.id]);

  const imageUrl = post.image
    ? `/${post.image}` // from post data
    : storedImage
    ? storedImage       // from localStorage
    : `https://picsum.photos/seed/${post.id}/600/400`; // fallback

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex flex-col rounded-xl shadow-sm hover:shadow-md transition bg-white overflow-hidden min-h-[420px]">
        <div className="aspect-[3/2] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt="Post"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>

          <div className="pt-2 mt-auto flex justify-end items-center text-blue-600 hover:text-blue-800 transition">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
