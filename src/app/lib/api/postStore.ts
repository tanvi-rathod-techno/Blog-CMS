import axios from 'axios';

const PAGE_SIZE = 12;

export const fetchPosts = async (page: number) => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/posts', {
    params: { _page: page, _limit: PAGE_SIZE },
  });
  return res.data as any[];
};


export async function fetchPostById(id: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }
    return res.json();
}
  

