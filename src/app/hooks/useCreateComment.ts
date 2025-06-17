// hooks/useCreateComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, Comment } from '@/app/lib/api';

interface CreateCommentArgs {
  postId: number;
  comment: Omit<Comment, 'id' | 'postId'>;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, comment }: CreateCommentArgs) =>
      createComment(postId, comment),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};
