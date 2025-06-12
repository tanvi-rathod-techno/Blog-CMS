'use client';

import Link from "next/link";
import { useState } from "react";
import CreatePostModal from "../posts/CreatePostModal"; // adjust the path if needed

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow-sm py-4 px-6 sm:px-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-900">Blogs</Link>
          
          <nav className="hidden sm:flex space-x-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-900">Home</Link>
            <Link href="/about" className="hover:text-blue-900">About</Link>
            <button
              onClick={() => setShowModal(true)}
              className="hover:text-blue-900 transition"
            >
              Create
            </button>
          </nav>
        </div>
      </header>

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  );
}
