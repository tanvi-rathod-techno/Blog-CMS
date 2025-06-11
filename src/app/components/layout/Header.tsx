'use client';
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 sm:px-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">Blogs</Link>
        <nav className="hidden sm:flex space-x-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/create" className="hover:text-blue-600">Create</Link>
        </nav>
      </div>
    </header>
  );
}