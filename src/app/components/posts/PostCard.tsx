import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex flex-col rounded-xl shadow-sm hover:shadow-md transition bg-white overflow-hidden min-h-[420px]">
        <div className="aspect-[3/2] w-full overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${post.id}/600/400`}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>
        </div>
      </div>
    </Link>
  );
}
