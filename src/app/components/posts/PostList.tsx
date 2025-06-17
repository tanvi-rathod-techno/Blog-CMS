'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from '@/app/components/posts/PostCard';
import { fetchPosts, Post } from '../../lib/api/postStore';

const PAGE_SIZE = 12;

export default function PostsList() {
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('localPosts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalPosts(parsed);
      } catch {
        setLocalPosts([]);
      }
    }
  }, []);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchPosts(pageParam, PAGE_SIZE);
      if (totalPosts === null) setTotalPosts(res.totalCount);
      return res.posts;
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) =>
      totalPosts !== null && pages.flat().length < totalPosts
        ? pages.length + 1
        : undefined,
  });

  const posts = useMemo(() => {
    const apiPosts = data?.pages.flat() ?? [];
    const all = [...localPosts, ...apiPosts];

    return all.sort((a, b) => {
      const dateA = new Date(a.createdAt ?? '').getTime();
      const dateB = new Date(b.createdAt ?? '').getTime();
      return dateB - dateA || b.id - a.id;
    });
  }, [data, localPosts]);

  if (isLoading)
    return <div className="text-center py-8">Loading posts...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching posts
      </div>
    );

  return (
    <div className="w-full max-w-8xl mx-auto px-4 py-8">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <p className="text-center py-4 text-gray-500">Loading more posts...</p>
        }
        endMessage={
          <p className="text-center py-4 text-gray-500">No more posts</p>
        }
      >
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
