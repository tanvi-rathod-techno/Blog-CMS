import axios from 'axios';

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

interface FetchPostsResult {
  posts: Post[];
  totalCount: number;
}

// Fetch paginated posts
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

// Fetch single post by ID
export async function fetchPostById(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

// Create new post
export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
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

//Fetch comments for a post (API + localStorage)
export async function fetchCommentsByPostId(postId: number): Promise<Comment[]> {
  const res = await axios.get<Comment[]>(
    `https://jsonplaceholder.typicode.com/comments`,
    { params: { postId } }
  );

  const apiComments = res.data;
  const localComments = getLocalComments(postId);

  // Show local comments first
  return [...localComments, ...apiComments];
}

//  Create a new comment for a post and store it in localStorage
export async function createComment(
  postId: number,
  comment: Omit<Comment, 'id' | 'postId'>
): Promise<Comment> {
  const res = await axios.post(`https://jsonplaceholder.typicode.com/comments`, {
    ...comment,
    postId,
  });

  const newComment: Comment = {
    ...res.data,
    id: Date.now(),
    postId,
  };

  // Save to localStorage
  const allLocalComments = JSON.parse(localStorage.getItem('localComments') || '{}');
  const postComments = allLocalComments[postId] || [];
  allLocalComments[postId] = [newComment, ...postComments];
  localStorage.setItem('localComments', JSON.stringify(allLocalComments));

  return newComment;
}

// Helper: Get local comments by postId
function getLocalComments(postId: number): Comment[] {
  try {
    const all = JSON.parse(localStorage.getItem('localComments') || '{}');
    return all[postId] || [];
  } catch {
    return [];
  }
}
