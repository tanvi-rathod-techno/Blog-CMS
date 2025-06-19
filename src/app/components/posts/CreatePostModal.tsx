'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/app/lib/api/postStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostFormData } from '@/app/lib/schemas/postSchema';

interface CreatePostModalProps {
  onClose: () => void;
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // cleanup
    }
  }, [selectedImage]);
  

  const onSubmit = async (data: PostFormData) => {
    try {
      let uploadedFileName: string | null = null;
  
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.set('file', selectedImage);
  
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });
  
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) {
          uploadedFileName = uploadJson.fileName;
        }
      }
  
      const newPost = await createPost({ ...data, userId: 1, image: uploadedFileName ?? undefined });
  
    
      if (uploadedFileName && newPost?.id) {
        const existingImages = JSON.parse(localStorage.getItem('postImages') || '{}');
        existingImages[newPost.id] = uploadedFileName;
        localStorage.setItem('postImages', JSON.stringify(existingImages));
        console.log('Saved to localStorage:', existingImages);
      }
      
      queryClient.setQueryData(['posts'], (oldData: { pages: PostFormData[][] } | undefined) => {
        if (!oldData) return oldData;
  
        return {
          ...oldData,
          pages: [[newPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      });
  
      reset();
      setSelectedImage(null);
      setPreviewUrl(null);
      setMessage({ type: 'success', text: 'Post created successfully!' });
  
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to create post. Try again.' });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
     <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl animate-fadeIn">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Create Blog Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              {...register('title')}
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              {...register('body')}
              placeholder="Write your content"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
            <input type ="file" placeholder="Imapge Upload"
             onChange={handleImageChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              {previewUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Image Preview:</p>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={600}
                  height={400}
                  className="mt-2 w-full h-64 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
          >
            Publish Post
          </button>

          {message && (
            <p
              className={`text-center mt-2 font-medium ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
