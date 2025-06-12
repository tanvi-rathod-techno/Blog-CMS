'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/app/lib/api/postStore';

interface CreatePostModalProps {
  onClose: () => void;
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const newPost = await createPost(data);

      // Update cache manually for infinite query
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [[newPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      });

      reset();
      setImagePreview(null);
      onClose();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-2xl p-6 rounded-xl shadow-2xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Create Blog Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-56 object-cover rounded border"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              {...register('title')}
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              {...register('body')}
              placeholder="Write your content"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}
