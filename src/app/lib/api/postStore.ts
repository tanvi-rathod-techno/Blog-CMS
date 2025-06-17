// lib/api.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  createdAt?: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface FetchPostsResult {
  posts: Post[];
  totalCount: number;
}

export const fetchPosts = async (
  page: number,
  pageSize = 12
): Promise<FetchPostsResult> => {
  const res = await axios.get<Post[]>(`${BASE_URL}/posts`, {
    params: { _page: page, _limit: pageSize, _sort: 'id', _order: 'desc' },
  });
  const totalCount = Number(res.headers['x-total-count'] || 100);
  return { posts: res.data, totalCount };
};

export async function fetchPostById(id: string): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 1 }),
  });

  const post = await res.json();
  const fakePost = {
    ...post,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  const stored = JSON.parse(localStorage.getItem('localPosts') || '[]');
  stored.unshift(fakePost);
  localStorage.setItem('localPosts', JSON.stringify(stored));

  return fakePost;
}

export async function fetchCommentsByPostId(postId: number): Promise<Comment[]> {
  const res = await axios.get<Comment[]>(`${BASE_URL}/comments`, {
    params: { postId },
  });
  return [...getLocalComments(postId), ...res.data];
}

export type CreateCommentInput = Omit<Comment, 'id' | 'postId'>;

export const createComment = async (
  postId: number,
  commentData: CreateCommentInput
): Promise<Comment> => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      ...commentData,
      postId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to create comment');
  }

  return res.json(); // returns a Comment
};

function getLocalComments(postId: number): Comment[] {
  try {
    const all = JSON.parse(localStorage.getItem('localComments') || '{}');
    return all[postId] || [];
  } catch {
    return [];
  }
}

