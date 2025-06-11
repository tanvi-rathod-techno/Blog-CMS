'use client';
import React from 'react';
import { generatePageItems } from '@/app/lib/pagination';

interface Props {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageItems = generatePageItems(totalPages, currentPage, 7);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center space-x-1 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        ← Previous
      </button>

      {pageItems.map((item, idx) =>
        item === 'dots' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`px-3 py-2 rounded ${
              item === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${
          currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Next →
      </button>
    </nav>
  );
}
