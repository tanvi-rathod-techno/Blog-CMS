'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useMemo } from 'react';
import PostCard from '@/app/components/posts/PostCard';
import { fetchPosts } from '../../lib/api/postStore';

const PAGE_SIZE = 12;
const TOTAL_POSTS = 100;

export default function PostsList() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (_, pages) =>
      pages.length * PAGE_SIZE < TOTAL_POSTS
        ? pages.length + 1
        : undefined,
  });

  const posts = useMemo(() => data?.pages.flat() ?? [], [data]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-px" />
      {isFetchingNextPage && (
        <p className="text-center py-4 text-gray-500">
          Loading more posts...
        </p>
      )}
      {!hasNextPage && (
        <p className="text-center py-4 text-gray-500">No more posts</p>
      )}
    </div>
  );
}
