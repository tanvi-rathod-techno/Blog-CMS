import axios from 'axios';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  createdAt?: string; // optional for fake timestamp
}

interface FetchPostsResult {
  posts: Post[];
  totalCount: number;
}

export const fetchPosts = async (
  page: number,
  pageSize = 12
): Promise<FetchPostsResult> => {
  const res = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
    params: {
      _page: page,
      _limit: pageSize,
      _sort: 'id',
      _order: 'desc',
    },
  });

  const totalCount = Number(res.headers['x-total-count'] || 100);
  return {
    posts: res.data,
    totalCount,
  };
};

export async function fetchPostById(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    throw new Error('Post not found');
  }
  return res.json();
}

export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 1 }),
  });

  const post = await res.json();
  const fakePost = {
    ...post,
    id: Date.now(), // simulate unique ID
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  const stored = JSON.parse(localStorage.getItem('localPosts') || '[]');
  stored.unshift(fakePost);
  localStorage.setItem('localPosts', JSON.stringify(stored));

  return fakePost;
}
