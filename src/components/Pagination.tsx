import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn pagination-nav-btn inter-bold"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon className="pagination-icon" strokeWidth={2.5} />
        <span className="pagination-text">Back</span>
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={`${page}-${index}`}
            className={`pagination-btn pagination-number inter-bold ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
            disabled={page === '...'}
            onClick={() => {
              if (typeof page === 'number') onPageChange(page);
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-nav-btn inter-bold"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="pagination-text">Next</span>
        <ChevronRightIcon className="pagination-icon" strokeWidth={2.5} />
      </button>
    </div>
  );
}
