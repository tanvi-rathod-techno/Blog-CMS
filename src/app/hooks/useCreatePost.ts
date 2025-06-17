// hooks/useCreatePost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, Post } from '@/app/lib/api';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
