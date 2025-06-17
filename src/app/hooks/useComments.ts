// hooks/useComments.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByPostId } from '@/app/lib/api';

export const useComments = (postId: number) =>
  useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!postId,
  });
