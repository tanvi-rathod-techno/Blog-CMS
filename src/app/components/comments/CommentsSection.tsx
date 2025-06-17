'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createComment, fetchCommentsByPostId } from '@/app/lib/api/postStore';
import type { Comment, CreateCommentInput } from '@/app/lib/api/postStore';


type Props = {
  postId: number;
};

export default function CommentSection({ postId }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; email: string; body: string }>();

  const mutation = useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: (commentData) => createComment(postId, commentData),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (old = []) => [
        newComment,
        ...old,
      ]);
      reset();
    },
  });
  

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6 text-blue-900">Comments</h2>

      {isLoading && <p className="text-gray-500 italic">Loading comments...</p>}
      {isError && <p className="text-red-500">Failed to load comments.</p>}

      <ul className="space-y-6 mb-10">
        {(data || []).map((comment) => (
          <li key={comment.id} className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-md font-semibold text-gray-800">{comment.name}</h4>
              <span className="text-sm text-gray-500 italic">{comment.email}</span>
            </div>
            <p className="text-gray-700">{comment.body}</p>
          </li>
        ))}
      </ul>

      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-gray-50 p-6 rounded-xl border shadow"
      >
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Add a Comment</h3>

        <div>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="Your email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register('body', { required: 'Comment is required' })}
            placeholder="Write your comment here..."
            className="w-full px-4 py-2 border rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </section>
  );
}
