'use client';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      reset();
      router.push("/");
    } catch (err) {
      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
    <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-6 py-10">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("title")} placeholder="Title" className="border p-2 w-full" required />
      <textarea {...register("body")} placeholder="Body" className="border p-2 w-full" required />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Post
      </button>
    </form>
    </main>
  </div>
   
  );
}