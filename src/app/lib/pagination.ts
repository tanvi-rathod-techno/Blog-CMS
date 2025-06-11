export function generatePageItems(
    totalPages: number,
    currentPage: number,
    maxVisible: number = 7
  ): (number | 'dots')[] {
    const half = Math.floor(maxVisible / 2);
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'dots')[] = [];
  
    if (currentPage <= half + 1) {
      pages.push(...Array.from({ length: maxVisible - 2 }, (_, i) => i + 1), 'dots', totalPages);
    } else if (currentPage >= totalPages - half) {
      pages.push(1, 'dots', ...Array.from({ length: maxVisible - 2 }, (_, i) => totalPages - (maxVisible - 2) + i));
    } else {
      pages.push(1, 'dots', currentPage - 1, currentPage, currentPage + 1, 'dots', totalPages);
    }
  
    return pages;
  }
  