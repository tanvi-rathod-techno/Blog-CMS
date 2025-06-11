'use client';

import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function CommentsSection({ postId }: { postId: string }) {
  const { data = [], isLoading, isError } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      if (!res.ok) throw new Error('Error fetching comments');
      return res.json();
    },
  });

  const { register, handleSubmit, reset } = useForm();
  const [newComment, setNewComment] = useState<Comment | null>(null);

  const onSubmit = (data: any) => {
    const fakeComment = {
      id: Date.now(),
      postId: +postId,
      name: data.name,
      email: data.email,
      body: data.body,
    };
    setNewComment(fakeComment);
    reset();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {isLoading && <p className="text-gray-500">Loading comments...</p>}
      {isError && <p className="text-red-500">Error loading comments.</p>}

      <ul className="space-y-4 mb-6">
        {data.map((comment) => (
          <li key={comment.id} className="border p-4 rounded-md">
            <p className="font-semibold">{comment.name}</p>
            <p className="text-sm text-gray-600">{comment.email}</p>
            <p className="mt-2">{comment.body}</p>
          </li>
        ))}
        {newComment && (
          <li className="border p-4 rounded-md bg-green-50">
            <p className="font-semibold">{newComment.name}</p>
            <p className="text-sm text-gray-600">{newComment.email}</p>
            <p className="mt-2">{newComment.body}</p>
          </li>
        )}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('name', { required: true })}
            placeholder="Your name"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Your email"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <textarea
            {...register('body', { required: true })}
            placeholder="Your comment"
            className="w-full border rounded p-2 h-24"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Comment
        </button>
      </form>
    </div>
  );
}
