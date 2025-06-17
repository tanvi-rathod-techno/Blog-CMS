import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/app/lib/api';
import type { FetchPostsResult } from '@/app/lib/api';

export const usePosts = () =>
  useInfiniteQuery<FetchPostsResult, Error, FetchPostsResult, [_: string], number>({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(lastPage.totalCount / 12);
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
