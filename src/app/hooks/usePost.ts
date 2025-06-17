// hooks/usePost.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPostById } from '@/app/lib/api';

export const usePost = (id: string) =>
  useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  });
